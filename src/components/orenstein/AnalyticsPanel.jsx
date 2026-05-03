import React, { useMemo, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';
import { Activity, TrendingUp, Layers, BarChart2 } from 'lucide-react';

const COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b', '#10b981', '#f43f5e'];

const CustomTooltip = ({ active, payload, label, isDarkMode }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={`px-4 py-3 rounded-2xl border text-xs font-bold shadow-xl ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
      <p className={`mb-1 text-[10px] uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: <span className="font-black">{p.value}</span></p>
      ))}
    </div>
  );
};

export default function AnalyticsPanel({ isDarkMode, workspaces = [] }) {
  const [timeframe, setTimeframe] = useState(30);

  const { data: accessLogs = [], isLoading } = useQuery({
    queryKey: ['appAccessLogs'],
    queryFn: () => base44.entities.AppAccessLog.list('-created_date', 1000),
    initialData: [],
  });

  const wsNameMap = useMemo(() => {
    const m = {};
    workspaces.forEach(ws => { m[ws.id] = ws.name; });
    return m;
  }, [workspaces]);

  const { totalAccesses, dailyTrend, byWorkspace, topApps } = useMemo(() => {
    const cutoff = moment().subtract(timeframe, 'days').startOf('day');
    const filtered = accessLogs.filter(l => moment(l.created_date).isAfter(cutoff));

    // Total
    const totalAccesses = filtered.length;

    // Tendência diária
    const dailyCounts = {};
    filtered.forEach(l => {
      const d = moment(l.created_date).format('DD/MM');
      dailyCounts[d] = (dailyCounts[d] || 0) + 1;
    });
    // Fill all days in range
    const dailyTrend = [];
    for (let i = timeframe - 1; i >= 0; i--) {
      const d = moment().subtract(i, 'days').format('DD/MM');
      dailyTrend.push({ date: d, Acessos: dailyCounts[d] || 0 });
    }

    // Por workspace
    const wsCounts = {};
    filtered.forEach(l => {
      const key = l.workspace_id || 'Desconhecido';
      wsCounts[key] = (wsCounts[key] || 0) + 1;
    });
    const byWorkspace = Object.entries(wsCounts)
      .map(([id, count]) => ({ name: wsNameMap[id] || id.substring(0, 8) + '…', Acessos: count }))
      .sort((a, b) => b.Acessos - a.Acessos);

    // Top apps
    const appCounts = {};
    filtered.forEach(l => {
      const key = l.app_title || l.app_id;
      appCounts[key] = (appCounts[key] || 0) + 1;
    });
    const topApps = Object.entries(appCounts)
      .map(([name, count]) => ({ name, Acessos: count }))
      .sort((a, b) => b.Acessos - a.Acessos)
      .slice(0, 8);

    return { totalAccesses, dailyTrend, byWorkspace, topApps };
  }, [accessLogs, timeframe, wsNameMap]);

  const axisStyle = { fontSize: 10, fontWeight: 700, fill: isDarkMode ? '#64748b' : '#94a3b8' };
  const gridColor = isDarkMode ? '#1e293b' : '#f1f5f9';
  const lineColor = '#3b82f6';

  const kpis = [
    { label: 'Total de Acessos', value: totalAccesses, icon: Activity, color: 'blue' },
    { label: 'Dias Analisados', value: timeframe, icon: TrendingUp, color: 'indigo' },
    { label: 'Workspaces Ativos', value: byWorkspace.length, icon: Layers, color: 'violet' },
    { label: 'Apps Distintos', value: topApps.length, icon: BarChart2, color: 'purple' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-3xl font-black uppercase italic tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Analytics</h2>
          <p className={`text-xs font-bold mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Logs de acesso · Últimos {timeframe} dias</p>
        </div>
        <div className={`flex rounded-2xl border overflow-hidden flex-shrink-0 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          {[7, 14, 30, 90].map(t => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${timeframe === t ? (isDarkMode ? 'bg-blue-600 text-white' : 'bg-slate-900 text-white') : (isDarkMode ? 'bg-transparent text-slate-500 hover:text-slate-300' : 'bg-transparent text-slate-400 hover:text-slate-700')}`}
            >
              {t}d
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={`p-5 rounded-[2rem] border ${isDarkMode ? 'bg-slate-900/40 border-slate-800/60' : 'bg-white border-slate-200'}`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 bg-${color}-500/10`}>
              <Icon className={`w-4 h-4 text-${color}-500`} />
            </div>
            <p className={`text-3xl font-black tabular-nums ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{value.toLocaleString('pt-BR')}</p>
            <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{label}</p>
          </div>
        ))}
      </div>

      {/* Linha: tendência diária */}
      <div className={`p-6 rounded-[2rem] border ${isDarkMode ? 'bg-slate-900/40 border-slate-800/60' : 'bg-white border-slate-200'}`}>
        <p className={`text-[11px] font-black uppercase tracking-widest mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Tendência de Acessos Diários</p>
        <div style={{ width: '100%', height: 220 }}>
          <ResponsiveContainer>
            <LineChart data={dailyTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="date" tick={axisStyle} tickLine={false} axisLine={false} interval={Math.floor(timeframe / 7)} />
              <YAxis tick={axisStyle} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip isDarkMode={isDarkMode} />} />
              <Line type="monotone" dataKey="Acessos" stroke={lineColor} strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: lineColor }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Barras: workspace + top apps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Por workspace */}
        <div className={`p-6 rounded-[2rem] border ${isDarkMode ? 'bg-slate-900/40 border-slate-800/60' : 'bg-white border-slate-200'}`}>
          <p className={`text-[11px] font-black uppercase tracking-widest mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Acessos por Workspace</p>
          {byWorkspace.length === 0 ? (
            <div className={`flex items-center justify-center h-40 text-xs font-bold ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>Sem dados</div>
          ) : (
            <div style={{ width: '100%', height: 220 }}>
              <ResponsiveContainer>
                <BarChart data={byWorkspace} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="name" tick={axisStyle} tickLine={false} axisLine={false} />
                  <YAxis tick={axisStyle} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip isDarkMode={isDarkMode} />} />
                  <Bar dataKey="Acessos" radius={[6, 6, 0, 0]}>
                    {byWorkspace.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Top apps */}
        <div className={`p-6 rounded-[2rem] border ${isDarkMode ? 'bg-slate-900/40 border-slate-800/60' : 'bg-white border-slate-200'}`}>
          <p className={`text-[11px] font-black uppercase tracking-widest mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Top Aplicativos Acessados</p>
          {topApps.length === 0 ? (
            <div className={`flex items-center justify-center h-40 text-xs font-bold ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>Sem dados</div>
          ) : (
            <div className="space-y-3">
              {topApps.map((app, i) => {
                const max = topApps[0].Acessos;
                const pct = Math.round((app.Acessos / max) * 100);
                return (
                  <div key={app.name} className="flex items-center gap-3">
                    <span className={`text-[10px] font-black w-5 text-right flex-shrink-0 ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`}>{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-bold truncate ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{app.name}</span>
                        <span className={`text-[10px] font-black flex-shrink-0 ml-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{app.Acessos}</span>
                      </div>
                      <div className={`h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, background: COLORS[i % COLORS.length] }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}