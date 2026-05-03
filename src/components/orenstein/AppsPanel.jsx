import React, { useState, useMemo } from 'react';
import { Sparkles, LayoutGrid, List, X, Tag, Search } from 'lucide-react';
import { ICON_MAP } from './iconMap';
import { WORKSPACE_COLORS } from './workspaceColors';
import AppCard from './AppCard';
import AppListItem from './AppListItem';
import AppsPanelToolbar from './AppsPanelToolbar';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useFavorites } from '../../hooks/useFavorites';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('appViewMode') || 'grid');
  const [selectedTags, setSelectedTags] = useState([]);
  const [showTagFilter, setShowTagFilter] = useState(false);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

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
  const rawActiveApps = apps.filter(a => a.workspace_id === activeWorkspace?.id && !a.is_archived);

  // All tags across current workspace apps
  const allTags = useMemo(() => {
    const tagSet = new Set();
    rawActiveApps.forEach(app => (app.tags || []).forEach(t => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [rawActiveApps]);

  // Apply all filters
  const activeApps = useMemo(() => {
    let filtered = rawActiveApps;
    if (activeFilter === 'favorites') {
      filtered = filtered.filter(a => isFavorite(a.id));
    }
    if (selectedTags.length > 0) {
      filtered = filtered.filter(a => selectedTags.every(t => (a.tags || []).includes(t)));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(a =>
        a.title?.toLowerCase().includes(q) ||
        a.card_summary?.toLowerCase().includes(q) ||
        a.description?.replace(/<[^>]*>/g, '').toLowerCase().includes(q) ||
        a.category?.toLowerCase().includes(q) ||
        (a.tags || []).some(t => t.toLowerCase().includes(q))
      );
    }
    return filtered;
  }, [rawActiveApps, activeFilter, searchQuery, selectedTags, favorites]);

  const favoritesCount = rawActiveApps.filter(a => isFavorite(a.id)).length;
  const hasActiveFilters = searchQuery || selectedTags.length > 0 || activeFilter !== 'all';

  const toggleTag = (tag) => setSelectedTags(prev =>
    prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
  );

  const toggleViewMode = () => {
    const next = viewMode === 'grid' ? 'list' : 'grid';
    setViewMode(next);
    localStorage.setItem('appViewMode', next);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setActiveFilter('all');
  };

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
        <div className={`flex items-center gap-5 mb-8 p-6 rounded-[2rem] border ${isDarkMode ? 'bg-slate-900/30 border-slate-800/50' : 'bg-white border-slate-200'} shadow-sm`}>
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

      {/* Search + View Toggle + Tags row */}
      <div className={`mb-6 p-4 rounded-[1.5rem] border ${isDarkMode ? 'bg-slate-900/30 border-slate-800/50' : 'bg-white border-slate-200'} space-y-3`}>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
            <input
              type="text"
              placeholder="Buscar apps, categorias, tags..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={`w-full pl-11 pr-10 py-3 rounded-2xl text-sm font-bold border outline-none transition-all ${
                isDarkMode
                  ? 'bg-black/40 border-slate-800 text-white placeholder:text-slate-600 focus:border-blue-500/50'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-400'
              }`}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className={`w-4 h-4 ${isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`} />
              </button>
            )}
          </div>

          {/* Tags toggle */}
          {allTags.length > 0 && (
            <button
              onClick={() => setShowTagFilter(p => !p)}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl border text-xs font-black uppercase tracking-widest transition-all ${
                showTagFilter || selectedTags.length > 0
                  ? (isDarkMode ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700')
                  : (isDarkMode ? 'border-slate-800 text-slate-500 hover:text-slate-300' : 'border-slate-200 text-slate-500 hover:text-slate-700')
              }`}
            >
              <Tag className="w-4 h-4" />
              Tags
              {selectedTags.length > 0 && (
                <span className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-black ${isDarkMode ? 'bg-emerald-500 text-white' : 'bg-emerald-600 text-white'}`}>
                  {selectedTags.length}
                </span>
              )}
            </button>
          )}

          {/* Favorites filter */}
          <button
            onClick={() => setActiveFilter(activeFilter === 'favorites' ? 'all' : 'favorites')}
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl border text-xs font-black uppercase tracking-widest transition-all ${
              activeFilter === 'favorites'
                ? (isDarkMode ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-700')
                : (isDarkMode ? 'border-slate-800 text-slate-500 hover:text-slate-300' : 'border-slate-200 text-slate-500 hover:text-slate-700')
            }`}
          >
            ★ {favoritesCount > 0 ? favoritesCount : ''}
          </button>

          {/* View Mode Toggle */}
          <div className={`flex rounded-2xl border overflow-hidden ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            <button
              onClick={() => { setViewMode('grid'); localStorage.setItem('appViewMode', 'grid'); }}
              className={`px-3 py-3 transition-all ${viewMode === 'grid' ? (isDarkMode ? 'bg-blue-600 text-white' : 'bg-slate-900 text-white') : (isDarkMode ? 'bg-transparent text-slate-500 hover:text-slate-300' : 'bg-transparent text-slate-400 hover:text-slate-700')}`}
              title="Grade"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setViewMode('list'); localStorage.setItem('appViewMode', 'list'); }}
              className={`px-3 py-3 transition-all ${viewMode === 'list' ? (isDarkMode ? 'bg-blue-600 text-white' : 'bg-slate-900 text-white') : (isDarkMode ? 'bg-transparent text-slate-500 hover:text-slate-300' : 'bg-transparent text-slate-400 hover:text-slate-700')}`}
              title="Lista"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tag filter pills */}
        {showTagFilter && allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ${
                  selectedTags.includes(tag)
                    ? (isDarkMode ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-emerald-600 border-emerald-500 text-white')
                    : (isDarkMode ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20' : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100')
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {/* Status bar */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-1">
            <span className={`text-[11px] font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              {activeApps.length} de {rawActiveApps.length} aplicativos
            </span>
            <button onClick={clearFilters} className="flex items-center gap-1 text-[11px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest">
              <X className="w-3 h-3" /> Limpar filtros
            </button>
          </div>
        )}
      </div>

      {/* Export toolbar */}
      <AppsPanelToolbar
        isDarkMode={isDarkMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        favoritesCount={favoritesCount}
        filteredCount={activeApps.length}
        totalCount={rawActiveApps.length}
        apps={activeApps}
        hideSearchAndFilter
      />

      {/* Content */}
      {categorySections.length === 0 ? (
        <div className={`flex flex-col items-center justify-center py-32 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
          <Sparkles className="w-10 h-10 mb-4 opacity-40" />
          <p className="text-sm font-black uppercase tracking-widest opacity-60">
            {hasActiveFilters ? 'Nenhum resultado para os filtros aplicados' : 'Nenhum aplicativo neste workspace'}
          </p>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="mt-4 px-6 py-3 rounded-full bg-blue-600 text-white text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all">
              Limpar filtros
            </button>
          )}
        </div>
      ) : viewMode === 'list' ? (
        /* LIST VIEW */
        <div className="space-y-10 sm:space-y-16">
          {categorySections.map(({ category, apps: catApps }) => {
            const catColor = WORKSPACE_COLORS[category.color || 'blue'];
            const CatIcon = ICON_MAP[category.icon_key] || ICON_MAP['Package'];
            return (
              <div key={category.id}>
                <div className="flex items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
                  <div className={`p-3 rounded-2xl border shadow-lg ${catColor.border} ${catColor.bg} text-white flex-shrink-0`}>{CatIcon}</div>
                  <h3 className={`text-xl sm:text-2xl font-black uppercase italic tracking-widest ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{category.name}</h3>
                  <div className={`flex-1 h-px ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-200'}`} />
                </div>
                <div className={`rounded-[2rem] border overflow-hidden ${isDarkMode ? 'border-slate-800/50 bg-slate-900/20' : 'border-slate-200 bg-white'}`}>
                  {catApps.map(app => (
                    <AppListItem
                      key={app.id}
                      app={app}
                      isDarkMode={isDarkMode}
                      onSelect={onSelectApp}
                      onEdit={onEditApp}
                      onDelete={onDeleteApp}
                      onArchive={onArchiveApp}
                      isFavorite={isFavorite(app.id)}
                      onToggleFavorite={toggleFavorite}
                      onTagClick={(tag) => { toggleTag(tag); setShowTagFilter(true); }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* GRID VIEW */
        <div className="space-y-14 sm:space-y-24">
          {categorySections.map(({ category, apps: catApps }) => {
            const catColor = WORKSPACE_COLORS[category.color || 'blue'];
            const CatIcon = ICON_MAP[category.icon_key] || ICON_MAP['Package'];
            return (
              <div key={category.id}>
                <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10">
                  <div className={`p-3 rounded-2xl border shadow-lg ${catColor.border} ${catColor.bg} text-white flex-shrink-0`}>{CatIcon}</div>
                  <h3 className={`text-xl sm:text-2xl font-black uppercase italic tracking-widest ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{category.name}</h3>
                  <div className={`flex-1 h-px ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-200'}`} />
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full border flex-shrink-0 ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <Sparkles className="w-3 h-3 text-blue-500" />
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{catApps.length} Ativo{catApps.length !== 1 ? 's' : ''}</span>
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
                      isFavorite={isFavorite(app.id)}
                      onToggleFavorite={toggleFavorite}
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