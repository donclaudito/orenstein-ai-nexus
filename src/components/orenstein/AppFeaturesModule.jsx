import React, { useState } from 'react';
import { ExternalLink, Search, ChevronDown, ChevronUp, Layers, Sparkles, Globe } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { ICON_MAP } from './iconMap';
import { WORKSPACE_COLORS } from './workspaceColors';
import DescriptionPopover from './DescriptionPopover';

export default function AppFeaturesModule({ isDarkMode, workspaces, apps }) {
  const [search, setSearch] = useState('');
  const [selectedWsId, setSelectedWsId] = useState('all');
  const [selectedCat, setSelectedCat] = useState('all');
  const [expandedApp, setExpandedApp] = useState(null);
  const [popoverApp, setPopoverApp] = useState(null);

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => base44.entities.Category.list('order_index'),
    initialData: [],
  });

  const activeApps = apps.filter(a => !a.is_archived);

  const filtered = activeApps.filter(app => {
    const matchWs = selectedWsId === 'all' || app.workspace_id === selectedWsId;
    const matchCat = selectedCat === 'all' || app.category === selectedCat;
    const matchSearch = !search || app.title.toLowerCase().includes(search.toLowerCase()) ||
      (app.card_summary || '').toLowerCase().includes(search.toLowerCase());
    return matchWs && matchCat && matchSearch;
  });

  const grouped = categories
    .map(cat => ({
      category: cat,
      apps: filtered.filter(a => a.category === cat.name),
    }))
    .filter(s => s.apps.length > 0);

  // Apps sem categoria conhecida
  const knownCatNames = categories.map(c => c.name);
  const uncategorized = filtered.filter(a => !knownCatNames.includes(a.category));

  const sortedWorkspaces = [...workspaces].sort((a, b) => (a.order_index || 0) - (b.order_index || 0));

  return (
    <div className="max-w-7xl mx-auto space-y-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <p className={`text-[10px] font-black uppercase tracking-[0.3em] mb-1 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`}>
            Módulo de Funcionalidades
          </p>
          <h1 className={`text-3xl sm:text-4xl font-black uppercase italic tracking-tight leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Catálogo de Aplicativos
          </h1>
          <p className={`text-xs mt-2 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {activeApps.length} aplicativo{activeApps.length !== 1 ? 's' : ''} disponíve{activeApps.length !== 1 ? 'is' : 'l'}
          </p>
        </div>

        {/* Search */}
        <div className={`relative flex-1 max-w-sm`}>
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
          <input
            type="text"
            placeholder="Buscar aplicativo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={`w-full pl-11 pr-5 py-3.5 rounded-2xl text-sm font-medium border outline-none transition-all ${
              isDarkMode
                ? 'bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 focus:border-blue-500/50'
                : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-300'
            }`}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {/* Workspace filter */}
        <button
          onClick={() => setSelectedWsId('all')}
          className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
            selectedWsId === 'all'
              ? isDarkMode ? 'bg-blue-500 border-blue-400 text-white' : 'bg-blue-600 border-blue-400 text-white'
              : isDarkMode ? 'bg-slate-900/40 border-slate-800 text-slate-500 hover:text-slate-300' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400'
          }`}
        >
          Todos Workspaces
        </button>
        {sortedWorkspaces.map(ws => {
          const color = WORKSPACE_COLORS[ws.color || 'blue'];
          return (
            <button
              key={ws.id}
              onClick={() => setSelectedWsId(ws.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
                selectedWsId === ws.id
                  ? `${color.bg} border-transparent text-white shadow-lg`
                  : isDarkMode ? 'bg-slate-900/40 border-slate-800 text-slate-500 hover:text-slate-300' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400'
              }`}
            >
              {ws.name}
            </button>
          );
        })}

        {/* Divider */}
        <div className={`w-px self-stretch mx-1 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />

        {/* Category filter */}
        <button
          onClick={() => setSelectedCat('all')}
          className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
            selectedCat === 'all'
              ? isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-800 border-slate-700 text-white'
              : isDarkMode ? 'bg-slate-900/40 border-slate-800 text-slate-500 hover:text-slate-300' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400'
          }`}
        >
          Todas Categorias
        </button>
        {categories.map(cat => {
          const CatIcon = ICON_MAP[cat.icon_key] || ICON_MAP['Package'];
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.name)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
                selectedCat === cat.name
                  ? isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-800 border-slate-700 text-white'
                  : isDarkMode ? 'bg-slate-900/40 border-slate-800 text-slate-500 hover:text-slate-300' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400'
              }`}
            >
              <span className="w-3 h-3">{CatIcon}</span>
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className={`flex flex-col items-center justify-center py-32 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
          <Sparkles className="w-10 h-10 mb-4 opacity-40" />
          <p className="text-sm font-black uppercase tracking-widest opacity-60">Nenhum aplicativo encontrado</p>
        </div>
      ) : (
        <div className="space-y-16">
          {grouped.map(({ category, apps: catApps }) => {
            const catColor = WORKSPACE_COLORS[category.color || 'blue'];
            const CatIcon = ICON_MAP[category.icon_key] || ICON_MAP['Package'];
            return (
              <section key={category.id}>
                {/* Category header */}
                <div className="flex items-center gap-4 mb-8">
                  <div className={`p-3 rounded-2xl border shadow-lg ${catColor.border} ${catColor.bg} text-white flex-shrink-0`}>
                    {CatIcon}
                  </div>
                  <h3 className={`text-xl font-black uppercase italic tracking-widest ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {category.name}
                  </h3>
                  <div className={`flex-1 h-px ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-200'}`} />
                  <span className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    {catApps.length} app{catApps.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* App cards */}
                <div className="space-y-4">
                  {catApps.map(app => {
                    const ws = workspaces.find(w => w.id === app.workspace_id);
                    const wsColor = WORKSPACE_COLORS[ws?.color || 'blue'];
                    const isExpanded = expandedApp === app.id;
                    const hasDesc = app.description && app.description.replace(/<[^>]*>/g, '').trim();

                    return (
                      <div
                        key={app.id}
                        className={`rounded-[2rem] border transition-all overflow-hidden ${
                          isDarkMode
                            ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                            : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                        }`}
                      >
                        {/* App header row */}
                        <div className="flex items-center gap-4 p-5 sm:p-7">
                          {/* Color dot */}
                          <div className={`w-3 h-3 rounded-full flex-shrink-0 ${wsColor.bg}`} />

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h4 className={`font-black text-sm uppercase italic tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                {app.title}
                              </h4>
                              {ws && (
                                <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${isDarkMode ? 'border-slate-700 text-slate-500 bg-slate-800/60' : 'border-slate-200 text-slate-500 bg-slate-50'}`}>
                                  {ws.name}
                                </span>
                              )}
                            </div>
                            {app.card_summary && (
                              <p className={`text-xs font-medium truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                {app.card_summary}
                              </p>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {hasDesc && (
                              <button
                                onClick={() => setPopoverApp(app)}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                                  isDarkMode
                                    ? 'bg-violet-500/10 border-violet-500/20 text-violet-400 hover:bg-violet-500 hover:text-white'
                                    : 'bg-violet-50 border-violet-100 text-violet-600 hover:bg-violet-600 hover:text-white'
                                }`}
                              >
                                <Layers className="w-3 h-3" />
                                <span className="hidden sm:inline">Detalhes</span>
                              </button>
                            )}
                            <a
                              href={app.url.startsWith('http') ? app.url : `https://${app.url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                                isDarkMode
                                  ? 'bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white'
                                  : 'bg-blue-50 border-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white'
                              }`}
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span className="hidden sm:inline">Acessar</span>
                            </a>
                            {hasDesc && (
                              <button
                                onClick={() => setExpandedApp(isExpanded ? null : app.id)}
                                className={`p-2 rounded-xl border transition-all ${
                                  isDarkMode
                                    ? 'border-slate-700 text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                                    : 'border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                                }`}
                                title={isExpanded ? 'Recolher' : 'Expandir descrição'}
                              >
                                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Expanded description */}
                        {isExpanded && hasDesc && (
                          <div className={`px-7 pb-7 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                            <div
                              className={`pt-6 prose prose-sm max-w-none text-[14px] leading-relaxed ${
                                isDarkMode
                                  ? 'prose-invert prose-p:text-slate-300 prose-li:text-slate-300 prose-strong:text-white prose-headings:text-white'
                                  : 'prose-p:text-slate-600 prose-li:text-slate-600 prose-strong:text-slate-900'
                              }`}
                              dangerouslySetInnerHTML={{ __html: app.description }}
                            />
                            <div className="flex items-center gap-2 mt-6 pt-5 border-t border-dashed ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}">
                              <Globe className={`w-3.5 h-3.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                              <a
                                href={app.url.startsWith('http') ? app.url : `https://${app.url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`text-[10px] font-black uppercase tracking-widest transition-all ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                              >
                                {app.url}
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}

          {/* Uncategorized */}
          {uncategorized.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-8">
                <h3 className={`text-xl font-black uppercase italic tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  Outros
                </h3>
                <div className={`flex-1 h-px ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-200'}`} />
              </div>
              <div className="space-y-4">
                {uncategorized.map(app => (
                  <div key={app.id} className={`flex items-center gap-4 p-5 rounded-[2rem] border ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <span className={`font-black text-sm uppercase italic ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{app.title}</span>
                    <div className="flex-1" />
                    <a
                      href={app.url.startsWith('http') ? app.url : `https://${app.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${isDarkMode ? 'border-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white' : 'border-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white'}`}
                    >
                      <ExternalLink className="w-3 h-3" /> Acessar
                    </a>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Description Popover */}
      {popoverApp && (
        <DescriptionPopover
          title={popoverApp.title}
          content={popoverApp.description}
          isDarkMode={isDarkMode}
          onClose={() => setPopoverApp(null)}
        />
      )}
    </div>
  );
}