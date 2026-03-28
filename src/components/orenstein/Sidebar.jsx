import React, { useState, useEffect, useCallback } from 'react';
import {
  Layers, LayoutGrid, PackagePlus, FileText,
  Terminal as TerminalIcon, User, LogOut,
  ChevronDown, ChevronUp, Box, Star, GripVertical
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { ICON_MAP } from './iconMap';
import { WORKSPACE_COLORS } from './workspaceColors';
import Breadcrumbs from './Breadcrumbs';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export default function Sidebar({
  isDarkMode,
  activeTab,
  setActiveTab,
  activeApp,
  setActiveApp,
  currentWorkspace,
  activeWsId,
  setActiveWsId,
  workspaces,
  apps,
  collapsedSectors,
  toggleSectorCollapse,
  triggerNewApp,
  onReorderWorkspace
}) {
  const queryClient = useQueryClient();

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => base44.entities.Category.list('order_index'),
    initialData: [],
  });

  // ── Workspace ordering ──────────────────────────────────────────────────────
  const [localWsOrder, setLocalWsOrder] = useState([]);

  useEffect(() => {
    const sorted = [...workspaces].sort((a, b) => {
      if (a.is_favorite && !b.is_favorite) return -1;
      if (!a.is_favorite && b.is_favorite) return 1;
      return (a.order_index || 0) - (b.order_index || 0);
    });
    setLocalWsOrder(sorted);
  }, [workspaces]);

  // ── App ordering per category (local state keyed by categoryName) ───────────
  // { [categoryName]: AppAsset[] }
  const [localAppsByCat, setLocalAppsByCat] = useState({});

  useEffect(() => {
    // Build a map for the active workspace only
    const wsApps = apps.filter(app => app.workspace_id === activeWsId && !app.is_archived);
    const map = {};
    categories.forEach(cat => {
      map[cat.name] = wsApps
        .filter(app => app.category === cat.name)
        .sort((a, b) => (a.order_index ?? 999) - (b.order_index ?? 999));
    });
    setLocalAppsByCat(map);
  }, [apps, categories, activeWsId]);

  // ── Workspace drag end ──────────────────────────────────────────────────────
  const handleWsDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.index === destination.index) return;

    const reordered = [...localWsOrder];
    const [moved] = reordered.splice(source.index, 1);
    reordered.splice(destination.index, 0, moved);
    setLocalWsOrder(reordered);
    onReorderWorkspace?.(reordered);
  };

  // ── App drag end (nested, restricted to same category) ─────────────────────
  const handleAppDragEnd = useCallback((categoryName) => (result) => {
    if (!result.destination) return;
    const { source, destination } = result;

    // Restrict: only reorder within the same droppable (same category)
    if (source.droppableId !== destination.droppableId) return;
    if (source.index === destination.index) return;

    const current = [...(localAppsByCat[categoryName] || [])];
    const [moved] = current.splice(source.index, 1);
    current.splice(destination.index, 0, moved);

    // Optimistic UI update
    setLocalAppsByCat(prev => ({ ...prev, [categoryName]: current }));

    // Persist new order_index to DB for all items in the list
    current.forEach((app, idx) => {
      base44.entities.AppAsset.update(app.id, { order_index: idx });
    });

    // Invalidate after a short delay to avoid race conditions
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ['apps'] });
    }, 600);
  }, [localAppsByCat, queryClient]);

  const handleBreadcrumbNavigate = (level) => {
    if (level === 'workspace' || level === 'sector') {
      setActiveApp(null);
      setActiveTab("Aplicações");
    }
  };

  return (
    <aside className={`w-full lg:w-80 backdrop-blur-2xl lg:border-r flex flex-col z-30 h-full ${isDarkMode ? 'bg-slate-950/40 lg:border-slate-800/50' : 'bg-white lg:border-slate-200'}`}>

      {/* Logo */}
      <div className="p-8 mb-4">
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => { setActiveTab("Aplicações"); setActiveApp(null); }}>
          <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black italic shadow-lg group-hover:scale-105 transition-all duration-500 text-xl">O</div>
          <div>
            <h1 className={`text-xl font-black tracking-tighter uppercase italic leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Orenstein</h1>
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Neural Hub</span>
          </div>
        </div>
      </div>

      <Breadcrumbs
        isDarkMode={isDarkMode}
        currentWorkspace={currentWorkspace}
        activeApp={activeApp}
        onNavigate={handleBreadcrumbNavigate}
      />

      <div className="flex-1 overflow-y-auto px-4 space-y-10 custom-scrollbar">

        {/* ── Workspaces (drag to reorder) ──────────────────────────────── */}
        <section>
          <p className={`px-4 text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Workspaces</p>
          <DragDropContext onDragEnd={handleWsDragEnd}>
            <Droppable droppableId="workspaces-list">
              {(provided) => (
                <div className="space-y-2" ref={provided.innerRef} {...provided.droppableProps}>
                  {localWsOrder.map((ws, index) => {
                    const isActive = activeWsId === ws.id;
                    const WsIcon = ICON_MAP[ws.icon_key] || Box;
                    const wsColor = WORKSPACE_COLORS[ws.color || 'blue'];

                    return (
                      <Draggable key={ws.id} draggableId={ws.id} index={index}>
                        {(drag, snapshot) => (
                          <div
                            ref={drag.innerRef}
                            {...drag.draggableProps}
                            style={{
                              ...drag.draggableProps.style,
                              opacity: snapshot.isDragging ? 0.88 : 1,
                              boxShadow: snapshot.isDragging
                                ? '0 0 0 2px rgba(59,130,246,0.7), 0 25px 50px -12px rgba(59,130,246,0.3)'
                                : undefined,
                              borderRadius: '1rem',
                              background: snapshot.isDragging
                                ? (isDarkMode ? '#0f172a' : '#ffffff')
                                : undefined,
                            }}
                            className="space-y-1"
                          >
                            <div className="flex items-center gap-1">
                              {/* Workspace drag handle */}
                              <div
                                {...drag.dragHandleProps}
                                style={{ cursor: snapshot.isDragging ? 'grabbing' : 'grab' }}
                                className={`p-1.5 rounded-xl flex-shrink-0 transition-colors ${isDarkMode ? 'text-slate-600 hover:text-slate-400' : 'text-slate-300 hover:text-slate-500'}`}
                                title="Arrastar workspace"
                              >
                                <GripVertical className="w-3.5 h-3.5" />
                              </div>

                              <button
                                onClick={() => setActiveWsId(ws.id)}
                                className={`flex-1 flex items-center gap-3 px-3 py-3 rounded-2xl text-xs font-bold transition-all relative ${
                                  isActive
                                    ? `${wsColor.light} ${wsColor.text} border ${wsColor.border}`
                                    : isDarkMode
                                    ? 'text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent'
                                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-transparent'
                                }`}
                              >
                                <div className={`p-1.5 rounded-lg ${isActive ? `${wsColor.bg} text-white shadow-lg` : ''}`}>
                                  {WsIcon}
                                </div>
                                <span className="truncate flex-1 text-left uppercase tracking-tight">{ws.name}</span>
                                {ws.is_favorite && <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />}
                              </button>
                            </div>

                            {/* ── Nested subitems (apps) per category ───── */}
                            {isActive && (
                              <div className="pl-6 space-y-1">
                                {categories.map(category => {
                                  const catApps = localAppsByCat[category.name] || [];
                                  if (catApps.length === 0) return null;
                                  const isCollapsed = collapsedSectors[category.name];

                                  return (
                                    <div key={category.id} className="space-y-1">
                                      {/* Category header */}
                                      <button
                                        onClick={() => toggleSectorCollapse(category.name)}
                                        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${isDarkMode ? 'text-slate-500 hover:text-slate-300 hover:bg-white/5' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'}`}
                                      >
                                        <div className="flex items-center gap-2">
                                          <span className="w-3.5 h-3.5 flex items-center justify-center">
                                            {ICON_MAP[category.icon_key] || ICON_MAP['Package']}
                                          </span>
                                          {category.name}
                                        </div>
                                        {isCollapsed ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
                                      </button>

                                      {/* Apps inside this category — isolated DragDropContext (prevents cross-group drag) */}
                                      {!isCollapsed && (
                                        <DragDropContext onDragEnd={handleAppDragEnd(category.name)}>
                                          <Droppable droppableId={`cat-${category.id}`} type={`apps-${category.id}`}>
                                            {(appProvided, appDropSnapshot) => (
                                              <div
                                                ref={appProvided.innerRef}
                                                {...appProvided.droppableProps}
                                                style={{
                                                  borderRadius: '0.75rem',
                                                  background: appDropSnapshot.isDraggingOver
                                                    ? (isDarkMode ? 'rgba(59,130,246,0.05)' : 'rgba(59,130,246,0.04)')
                                                    : undefined,
                                                  transition: 'background 0.15s',
                                                }}
                                                className="space-y-1 pb-1"
                                              >
                                                {catApps.map((app, appIdx) => (
                                                  <Draggable key={app.id} draggableId={app.id} index={appIdx}>
                                                    {(appDrag, appSnap) => (
                                                      <div
                                                        ref={appDrag.innerRef}
                                                        {...appDrag.draggableProps}
                                                        style={{
                                                          ...appDrag.draggableProps.style,
                                                          opacity: appSnap.isDragging ? 0.8 : 1,
                                                          boxShadow: appSnap.isDragging
                                                            ? '0 0 0 2px rgba(59,130,246,0.8), 0 20px 40px -10px rgba(59,130,246,0.35)'
                                                            : undefined,
                                                          borderRadius: '1rem',
                                                          background: appSnap.isDragging
                                                            ? (isDarkMode ? '#1e293b' : '#f8faff')
                                                            : undefined,
                                                        }}
                                                        className="flex items-center gap-1 group/approw"
                                                      >
                                                        {/* App drag handle */}
                                                        <div
                                                          {...appDrag.dragHandleProps}
                                                          style={{ cursor: appSnap.isDragging ? 'grabbing' : 'grab' }}
                                                          className={`flex-shrink-0 p-1.5 rounded-xl opacity-0 group-hover/approw:opacity-100 transition-all ${isDarkMode ? 'text-slate-600 hover:text-slate-400' : 'text-slate-300 hover:text-slate-500'}`}
                                                          title="Arrastar app"
                                                        >
                                                          <GripVertical className="w-3 h-3" />
                                                        </div>

                                                        {/* App button */}
                                                        <button
                                                          onClick={() => { setActiveApp(app); setActiveTab("Aplicações"); }}
                                                          className={`flex-1 flex items-center gap-3 px-3 py-2 rounded-2xl text-[10px] font-bold uppercase transition-all ${
                                                            activeApp?.id === app.id
                                                              ? (isDarkMode
                                                                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-sm'
                                                                  : 'bg-blue-50 text-blue-600 border border-blue-100 shadow-sm')
                                                              : (isDarkMode
                                                                  ? 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                                                                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100')
                                                          }`}
                                                        >
                                                          <span className="truncate">{app.title}</span>
                                                        </button>
                                                      </div>
                                                    )}
                                                  </Draggable>
                                                ))}
                                                {appProvided.placeholder}
                                              </div>
                                            )}
                                          </Droppable>
                                        </DragDropContext>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </section>

        <div className={`h-px mx-4 ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-100'}`} />

        {/* ── Infraestrutura ─────────────────────────────────────────────── */}
        <section>
          <p className={`px-4 text-[10px] font-black uppercase tracking-[0.3em] mb-6 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Infraestrutura</p>
          <div className="space-y-4 px-2">
            <div className={`p-4 rounded-[2.5rem] border transition-all duration-500 ${isDarkMode ? 'bg-slate-900/40 border-slate-800/50' : 'bg-slate-50 border-slate-200'}`}>
              <div className="space-y-2">
                <button onClick={() => { setActiveTab("Aplicações"); setActiveApp(null); }} className={`w-full flex items-center gap-4 px-5 py-4 rounded-3xl transition-all duration-300 border ${activeTab === 'Aplicações' && !activeApp ? (isDarkMode ? 'bg-blue-600 border-blue-400 shadow-lg text-white' : 'bg-white border-blue-200 text-blue-800 shadow-sm') : 'border-transparent text-slate-500 hover:text-blue-500'}`}>
                  <Layers className="w-5 h-5" />
                  <span className="text-xs font-black uppercase tracking-tight truncate flex-1 text-left">Painel Central</span>
                </button>
                <button onClick={() => { setActiveTab("Definições"); setActiveApp(null); }} className={`w-full flex items-center gap-4 px-5 py-4 rounded-3xl transition-all duration-300 border ${activeTab === 'Definições' ? (isDarkMode ? 'bg-blue-600 border-blue-400 shadow-lg text-white' : 'bg-white border-blue-200 text-blue-800 shadow-sm') : 'border-transparent text-slate-500 hover:text-blue-500'}`}>
                  <LayoutGrid className="w-5 h-5" />
                  <span className="text-xs font-black uppercase tracking-tight truncate flex-1 text-left">Gestão Workspaces</span>
                </button>
              </div>
            </div>

            <button onClick={triggerNewApp} className="w-full flex items-center justify-center gap-4 py-5 rounded-[2.5rem] text-xs font-black uppercase bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl hover:scale-105 active:scale-95 transition-all">
              <PackagePlus className="w-5 h-5" /> Adicionar Aplicativo
            </button>
          </div>
        </section>

        <div className={`h-px mx-4 ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-100'}`} />

        {/* ── Operacional ────────────────────────────────────────────────── */}
        <section>
          <p className={`px-4 text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Operacional</p>
          <div className="space-y-1.5">
            <button onClick={() => { setActiveTab("Notas"); setActiveApp(null); }} className={`w-full flex items-center gap-4 px-5 py-3 rounded-2xl text-xs font-bold transition-all border ${activeTab === 'Notas' ? 'bg-amber-500/10 border-amber-500/20 text-amber-600 shadow-sm' : 'text-slate-500 border-transparent hover:bg-black/5'}`}>
              <FileText className="w-4 h-4" /> Notas de Kernel
            </button>
            <button onClick={() => { setActiveTab("Terminal"); setActiveApp(null); }} className={`w-full flex items-center gap-4 px-5 py-3 rounded-2xl text-xs font-bold transition-all border ${activeTab === 'Terminal' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 shadow-sm' : 'text-slate-500 border-transparent hover:bg-black/5'}`}>
              <TerminalIcon className="w-4 h-4" /> Terminal Ativo
            </button>
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className={`p-6 border-t ${isDarkMode ? 'border-slate-800/50 bg-slate-900/20' : 'border-slate-100 bg-slate-50'}`}>
        <div className={`flex items-center gap-4 p-4 rounded-3xl border shadow-sm ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white shadow-md">
            <User className="w-6 h-6" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className={`text-[11px] font-black truncate uppercase italic leading-none mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Admin Orenstein</p>
            <button className="text-[9px] text-red-500 font-bold uppercase tracking-widest hover:text-red-400 flex items-center gap-1 transition-colors">
              <LogOut className="w-3 h-3" /> Terminar
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}