import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity, BarChart2, Layers, TrendingUp, Zap } from 'lucide-react';
import { WORKSPACE_COLORS } from './workspaceColors';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#14b8a6'];

export default function StatsPanel({ isDarkMode, apps, accessLogs, workspaces }) {
  const stats = useMemo(() => {
    const activeApps = apps.filter(a => !a.is_archived);
    const totalApps = activeApps.length;
    const totalAccesses = accessLogs.length;

    // Apps por categoria
    const byCategory = {};
    activeApps.forEach(app => {
      byCategory[app.category] = (byCategory[app.category] || 0) + 1;
    });
    const categoryData = Object.entries(byCategory)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Acessos por app
    const accessByApp = {};
    accessLogs.forEach(log => {
      const key = log.app_id;
      if (!accessByApp[key]) {
        accessByApp[key] = { title: log.app_title, category: log.app_category, count: 0 };
      }
      accessByApp[key].count++;
    });
    const topApps = Object.values(accessByApp)
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // Acessos por workspace
    const accessByWs = {};
    accessLogs.forEach(log => {
      accessByWs[log.workspace_id] = (accessByWs[log.workspace_id] || 0) + 1;
    });

    // Apps por workspace
    const appsByWs = workspaces.map(ws => ({
      name: ws.name,
      count: activeApps.filter(a => a.workspace_id === ws.id).length,
      color: ws.color || 'blue',
    })).sort((a, b) => b.count - a.count);

    return { totalApps, totalAccesses, categoryData, topApps, appsByWs };
  }, [apps, accessLogs, workspaces]);

  const card = `rounded-[2rem] border p-6 ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`;
  const label = `text-[9px] font-black uppercase tracking-[0.3em] mb-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`;
  const value = `text-3xl font-black italic tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`;

  const CustomTooltip = ({ active, payload, label: lbl }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className={`px-4 py-3 rounded-2xl border shadow-xl text-xs font-bold ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'}`}>
        <p className="font-black mb-1">{lbl}</p>
        <p className="text-blue-400">{payload[0].value} {payload[0].name === 'count' ? 'apps' : 'acessos'}</p>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg">
          <BarChart2 className="w-5 h-5" />
        </div>
        <div>
          <h2 className={`text-2xl font-black uppercase italic tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Painel de Estatísticas
          </h2>
          <p className={`text-xs font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            Visão geral de uso das aplicações
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={card}>
          <p className={label}>Total de Apps</p>
          <p className={value}>{stats.totalApps}</p>
          <div className="flex items-center gap-1.5 mt-2">
            <Layers className="w-3 h-3 text-blue-500" />
            <span className={`text-[10px] font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>ativos</span>
          </div>
        </div>
        <div className={card}>
          <p className={label}>Total de Acessos</p>
          <p className={value}>{stats.totalAccesses}</p>
          <div className="flex items-center gap-1.5 mt-2">
            <Activity className="w-3 h-3 text-emerald-500" />
            <span className={`text-[10px] font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>registrados</span>
          </div>
        </div>
        <div className={card}>
          <p className={label}>Categorias</p>
          <p className={value}>{stats.categoryData.length}</p>
          <div className="flex items-center gap-1.5 mt-2">
            <TrendingUp className="w-3 h-3 text-purple-500" />
            <span className={`text-[10px] font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>setores</span>
          </div>
        </div>
        <div className={card}>
          <p className={label}>Workspaces</p>
          <p className={value}>{workspaces.length}</p>
          <div className="flex items-center gap-1.5 mt-2">
            <Zap className="w-3 h-3 text-amber-500" />
            <span className={`text-[10px] font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>configurados</span>
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Apps por categoria */}
        <div className={card}>
          <p className={`${label} mb-5`}>Apps por Categoria</p>
          {stats.categoryData.length === 0 ? (
            <p className={`text-xs italic ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>Sem dados ainda</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.categoryData} layout="vertical" margin={{ left: 0, right: 16, top: 0, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 10, fontWeight: 700, fill: isDarkMode ? '#94a3b8' : '#64748b' }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }} />
                <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                  {stats.categoryData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Apps por workspace */}
        <div className={card}>
          <p className={`${label} mb-5`}>Apps por Workspace</p>
          {stats.appsByWs.length === 0 ? (
            <p className={`text-xs italic ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>Sem dados ainda</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.appsByWs} margin={{ left: 0, right: 16, top: 0, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 700, fill: isDarkMode ? '#94a3b8' : '#64748b' }} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {stats.appsByWs.map((ws, i) => {
                    const color = WORKSPACE_COLORS[ws.color]?.hex || COLORS[i % COLORS.length];
                    return <Cell key={i} fill={color} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Top apps por acesso */}
      <div className={card}>
        <p className={`${label} mb-6`}>Apps Mais Acessados</p>
        {stats.topApps.length === 0 ? (
          <div className={`flex flex-col items-center py-12 gap-3 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
            <Activity className="w-8 h-8 opacity-40" />
            <p className="text-xs font-black uppercase tracking-widest opacity-60">Nenhum acesso registrado ainda</p>
            <p className="text-[10px] opacity-40">Clique em um aplicativo para começar a rastrear</p>
          </div>
        ) : (
          <div className="space-y-3">
            {stats.topApps.map((app, i) => {
              const max = stats.topApps[0].count;
              const pct = Math.round((app.count / max) * 100);
              return (
                <div key={i} className="flex items-center gap-4">
                  <span className={`text-[10px] font-black w-5 text-right flex-shrink-0 ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`}>#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-black truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{app.title}</span>
                      <span className={`text-[10px] font-black ml-3 flex-shrink-0 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{app.count}x</span>
                    </div>
                    <div className={`h-1.5 rounded-full w-full ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                      <div
                        className="h-1.5 rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: COLORS[i % COLORS.length] }}
                      />
                    </div>
                    <span className={`text-[9px] font-bold ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>{app.category}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}