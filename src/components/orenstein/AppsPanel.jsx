import React from 'react';
import { Sparkles } from 'lucide-react';
import { ICON_MAP } from './iconMap';
import { WORKSPACE_COLORS } from './workspaceColors';
import AppCard from './AppCard';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

export default function AppsPanel({
  isDarkMode,
  activeWsId,
  setActiveWsId,
  workspaces,
  apps,
  onSelectApp,
  onEditApp,
  onDeleteApp,
  onArchiveApp,
}) {
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => base44.entities.Category.list('order_index'),
    initialData: [],
  });

  const sortedWorkspaces = [...workspaces].sort((a, b) => {
    if (a.is_favorite && !b.is_favorite) return -1;
    if (!a.is_favorite && b.is_favorite) return 1;
    return (a.order_index || 0) - (b.order_index || 0);
  });

  const activeWorkspace = sortedWorkspaces.find(w => w.id === activeWsId) || sortedWorkspaces[0];
  const activeApps = apps.filter(a => a.workspace_id === activeWorkspace?.id && !a.is_archived);

  const categorySections = categories
    .map(cat => ({
      category: cat,
      apps: activeApps
        .filter(a => a.category === cat.name)
        .sort((a, b) => (a.order_index ?? 999) - (b.order_index ?? 999)),
    }))
    .filter(s => s.apps.length > 0);

  const wsColor = WORKSPACE_COLORS[activeWorkspace?.color || 'blue'];
  const WsIcon = ICON_MAP[activeWorkspace?.icon_key] || ICON_MAP['Briefcase'];

  return (
    <div className="max-w-7xl mx-auto">

      {/* Workspace tab navigation */}
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-10 sm:mb-14">
        {sortedWorkspaces.map(ws => {
          const isActive = ws.id === activeWorkspace?.id;
          const color = WORKSPACE_COLORS[ws.color || 'blue'];
          const Icon = ICON_MAP[ws.icon_key] || ICON_MAP['Briefcase'];
          return (
            <button
              key={ws.id}
              onClick={() => setActiveWsId(ws.id)}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${
                isActive
                  ? `${color.bg} border-transparent text-white shadow-xl`
                  : isDarkMode
                  ? 'bg-slate-900/40 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700'
                  : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-800'
              }`}
            >
              <span className="w-3.5 h-3.5 flex-shrink-0">{Icon}</span>
              {ws.name}
            </button>
          );
        })}
      </div>

      {/* Active workspace header */}
      {activeWorkspace && (
        <div className={`flex items-center gap-5 mb-12 sm:mb-16 p-6 rounded-[2rem] border ${isDarkMode ? 'bg-slate-900/30 border-slate-800/50' : 'bg-white border-slate-200'} shadow-sm`}>
          <div className={`p-4 rounded-2xl border shadow-lg ${wsColor.border} ${wsColor.bg} text-white flex-shrink-0`}>
            {WsIcon}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className={`text-2xl sm:text-3xl font-black uppercase italic tracking-tight leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {activeWorkspace.name}
            </h2>
            {activeWorkspace.description && (
              <p className={`text-xs mt-1.5 font-medium truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {activeWorkspace.description}
              </p>
            )}
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full border flex-shrink-0 ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <Sparkles className="w-3 h-3 text-blue-500" />
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {activeApps.length} Ativo{activeApps.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}

      {/* Category sections */}
      {categorySections.length === 0 ? (
        <div className={`flex flex-col items-center justify-center py-32 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
          <Sparkles className="w-10 h-10 mb-4 opacity-40" />
          <p className="text-sm font-black uppercase tracking-widest opacity-60">Nenhum aplicativo neste workspace</p>
        </div>
      ) : (
        <div className="space-y-14 sm:space-y-24">
          {categorySections.map(({ category, apps: catApps }) => {
            const catColor = WORKSPACE_COLORS[category.color || 'blue'];
            const CatIcon = ICON_MAP[category.icon_key] || ICON_MAP['Package'];
            return (
              <div key={category.id}>
                <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10">
                  <div className={`p-3 rounded-2xl border shadow-lg ${catColor.border} ${catColor.bg} text-white flex-shrink-0`}>
                    {CatIcon}
                  </div>
                  <h3 className={`text-xl sm:text-2xl font-black uppercase italic tracking-widest ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {category.name}
                  </h3>
                  <div className={`flex-1 h-px ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-200'}`} />
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full border flex-shrink-0 ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <Sparkles className="w-3 h-3 text-blue-500" />
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {catApps.length} Ativo{catApps.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-8">
                  {catApps.map(app => (
                    <AppCard
                      key={app.id}
                      app={app}
                      isDarkMode={isDarkMode}
                      onSelect={onSelectApp}
                      onEdit={onEditApp}
                      onDelete={onDeleteApp}
                      onArchive={onArchiveApp}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}