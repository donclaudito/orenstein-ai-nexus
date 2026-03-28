import React, { useState, useEffect } from 'react';
import {
  Layers, LayoutGrid, PackagePlus, FileText,
  Terminal as TerminalIcon, User, LogOut,
  ChevronDown, ChevronUp, Box, Star, GripVertical, MoveRight
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { ICON_MAP } from './iconMap';
import { WORKSPACE_COLORS } from './workspaceColors';
import Breadcrumbs from './Breadcrumbs';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const encodeDropId = (wsId, catName) => `apps|${wsId}|${catName}`;
const decodeDropId = (id) => {
  const parts = id.split('|');
  return { wsId: parts[1], catName: parts[2] };
};

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

  const [localWsOrder, setLocalWsOrder] = useState([]);
  useEffect(() => {
    const sorted = [...workspaces].sort((a, b) => {
      if (a.is_favorite && !b.is_favorite) return -1;
      if (!a.is_favorite && b.is_favorite) return 1;
      return (a.order_index || 0) - (b.order_index || 0);
    });
    setLocalWsOrder(sorted);
  }, [workspaces]);

  const [appsMap, setAppsMap] = useState({});
  useEffect(() => {
    const map = {};
    workspaces.forEach(ws => {
      map[ws.id] = {};
      const wsApps = apps.filter(a => a.workspace_id === ws.id && !a.is_archived);
      categories.forEach(cat => {
        map[ws.id][cat.name] = wsApps
          .filter(a => a.category === cat.name)
          .sort((a, b) => (a.order_index ?? 999) - (b.order_index ?? 999));
      });
    });
    setAppsMap(map);
  }, [apps, categories, workspaces]);

  const [collapsedWs, setCollapsedWs] = useState({});
  const [isDraggingApp, setIsDraggingApp] = useState(false);
  const [draggingOverKey, setDraggingOverKey] = useState(null);

  const toggleWsExpand = (wsId) => {
    if (isDraggingApp) return;
    setCollapsedWs(prev => ({ ...prev, [wsId]: !prev[wsId] }));
  };

  const handleAppDragEnd = (result) => {
    setIsDraggingApp(false);
    setDraggingOverKey(null);
    const { source, destination } = result;
    if (!destination) return;
    const src = decodeDropId(source.droppableId);
    const dst = decodeDropId(destination.droppableId);
    if (src.wsId === dst.wsId && src.catName === dst.catName && source.index === destination.index) return;

    const snapshot = JSON.parse(JSON.stringify(appsMap));
    const next = JSON.parse(JSON.stringify(appsMap));
    if (!next[src.wsId]?.[src.catName]) return;
    const [movedApp] = next[src.wsId][src.catName].splice(source.index, 1);
    if (!movedApp) return;
    if (!next[dst.wsId]) next[dst.wsId] = {};
    if (!next[dst.wsId][dst.catName]) next[dst.wsId][dst.catName] = [];
    next[dst.wsId][dst.catName].splice(destination.index, 0, movedApp);
    setAppsMap(next);

    const updates = [];
    const movedFields = { order_index: destination.index };
    if (src.catName !== dst.catName) movedFields.category = dst.catName;
    if (src.wsId !== dst.wsId) movedFields.workspace_id = dst.wsId;
    updates.push(base44.entities.AppAsset.update(movedApp.id, movedFields));
    if (src.wsId !== dst.wsId || src.catName !== dst.catName) {
      next[src.wsId][src.catName].forEach((a, idx) => {
        updates.push(base44.entities.AppAsset.update(a.id, { order_index: idx }));
      });
    }
    next[dst.wsId][dst.catName].forEach((a, idx) => {
      updates.push(base44.entities.AppAsset.update(a.id, { order_index: idx }));
    });

    Promise.all(updates)
      .then(() => setTimeout(() => queryClient.invalidateQueries({ queryKey: ['apps'] }), 500))
      .catch(() => {
        setAppsMap(snapshot);
        queryClient.invalidateQueries({ queryKey: ['apps'] });
      });
  };

  const handleAppDragUpdate = (update) => {
    if (update.destination) {
      const { wsId, catName } = decodeDropId(update.destination.droppableId);
      setDraggingOverKey(`${wsId}|${catName}`);
    } else {
      setDraggingOverKey(null);
    }
  };

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

        <section>
          <p className={`px-4 text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Workspaces</p>

          <DragDropContext
            onDragStart={() => setIsDraggingApp(true)}
            onDragUpdate={handleAppDragUpdate}
            onDragEnd={handleAppDragEnd}
          >
            <div className="space-y-2">
              {localWsOrder.map((ws, wsIndex) => {
                const isActive = activeWsId === ws.id;
                const WsIcon = ICON_MAP[ws.icon_key] || Box;
                const wsColor = WORKSPACE_COLORS[ws.color || 'blue'];
                const isWsCollapsed = collapsedWs[ws.id];

                return (
                  <div key={ws.id} className="space-y-1">
                    <div className="flex items-center gap-1">
                      <div className="flex flex-col gap-0.5 p-1 flex-shrink-0">
                        <button
                          onClick={() => {
                            if (wsIndex === 0) return;
                            const r = [...localWsOrder];
                            [r[wsIndex - 1], r[wsIndex]] = [r[wsIndex], r[wsIndex - 1]];
                            setLocalWsOrder(r);
                            onReorderWorkspace?.(r);
                          }}
                          disabled={wsIndex === 0}
                          className={`p-0.5 rounded transition-colors ${wsIndex === 0 ? 'opacity-20 cursor-not-allowed' : (isDarkMode ? 'text-slate-600 hover:text-slate-400' : 'text-slate-300 hover:text-slate-500')}`}
                        >
                          <ChevronUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => {
                            if (wsIndex === localWsOrder.length - 1) return;
                            const r = [...localWsOrder];
                            [r[wsIndex + 1], r[wsIndex]] = [r[wsIndex], r[wsIndex + 1]];
                            setLocalWsOrder(r);
                            onReorderWorkspace?.(r);
                          }}
                          disabled={wsIndex === localWsOrder.length - 1}
                          className={`p-0.5 rounded transition-colors ${wsIndex === localWsOrder.length - 1 ? 'opacity-20 cursor-not-allowed' : (isDarkMode ? 'text-slate-600 hover:text-slate-400' : 'text-slate-300 hover:text-slate-500')}`}
                        >
                          <ChevronDown className="w-3 h-3" />
                        </button>
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
                        <div className={`p-1.5 rounded-lg ${isActive ? `${wsColor.bg} text-white shadow-lg` : ''}`}>{WsIcon}</div>
                        <span className="truncate flex-1 text-left uppercase tracking-tight">{ws.name}</span>
                        {ws.is_favorite && <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />}
                      </button>

                      <button
                        onClick={() => toggleWsExpand(ws.id)}
                        className={`p-1.5 rounded-xl flex-shrink-0 transition-colors ${isDarkMode ? 'text-slate-600 hover:text-slate-400' : 'text-slate-300 hover:text-slate-500'}`}
                        title={isWsCollapsed ? 'Expandir' : 'Recolher'}
                      >
                        {isWsCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {!isWsCollapsed && (
                      <div className="pl-6 space-y-1">
                        {categories.map(category => {
                          const catApps = appsMap[ws.id]?.[category.name] || [];
                          const dropId = encodeDropId(ws.id, category.name);
                          const isTargeted = draggingOverKey === `${ws.id}|${category.name}`;

                          if (catApps.length === 0 && !isTargeted) return null;

                          return (
                            <div key={category.id} className="space-y-1">
                              <div className={`w-full flex items-center gap-2 px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${
                                isTargeted
                                  ? (isDarkMode ? 'text-blue-400 bg-blue-500/10' : 'text-blue-600 bg-blue-50')
                                  : isDarkMode ? 'text-slate-500' : 'text-slate-400'
                              }`}>
                                <span className="w-3.5 h-3.5 flex items-center justify-center flex-shrink-0">
                                  {ICON_MAP[category.icon_key] || ICON_MAP['Package']}
                                </span>
                                <span>{category.name}</span>
                                {isTargeted && <MoveRight className="w-3 h-3 text-blue-500 ml-auto" />}
                              </div>

                              <Droppable droppableId={dropId} type="app-item">
                                {(appProvided, appDropSnap) => (
                                  <div
                                    ref={appProvided.innerRef}
                                    {...appProvided.droppableProps}
                                    style={{
                                      borderRadius: '0.75rem',
                                      minHeight: appDropSnap.isDraggingOver ? '2.5rem' : undefined,
                                      background: appDropSnap.isDraggingOver
                                        ? (isDarkMode ? 'rgba(59,130,246,0.07)' : 'rgba(59,130,246,0.05)')
                                        : undefined,
                                      transition: 'background 0.15s, min-height 0.15s',
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
                                                ? '0 0 0 2px rgba(59,130,246,0.85), 0 20px 40px -10px rgba(59,130,246,0.4)'
                                                : undefined,
                                              borderRadius: '1rem',
                                              background: appSnap.isDragging
                                                ? (isDarkMode ? '#1e293b' : '#f0f6ff')
                                                : undefined,
                                            }}
                                            className="flex items-center gap-1 group/approw"
                                          >
                                            <div
                                              {...appDrag.dragHandleProps}
                                              style={{ cursor: appSnap.isDragging ? 'grabbing' : 'grab' }}
                                              className={`flex-shrink-0 p-1.5 rounded-xl opacity-0 group-hover/approw:opacity-100 transition-opacity ${isDarkMode ? 'text-slate-600 hover:text-slate-400' : 'text-slate-300 hover:text-slate-500'}`}
                                              title="Arrastar — pode mover entre categorias e workspaces"
                                            >
                                              <GripVertical className="w-3 h-3" />
                                            </div>
                                            <button
                                              onClick={() => { setActiveApp(app); setActiveWsId(ws.id); setActiveTab("Aplicações"); }}
                                              className={`flex-1 flex items-center gap-3 px-3 py-2 rounded-2xl text-[10px] font-bold uppercase transition-all ${
                                                activeApp?.id === app.id
                                                  ? (isDarkMode ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-sm' : 'bg-blue-50 text-blue-600 border border-blue-100 shadow-sm')
                                                  : (isDarkMode ? 'text-slate-500 hover:text-slate-300 hover:bg-white/5' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100')
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
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </DragDropContext>
        </section>

        <div className={`h-px mx-4 ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-100'}`} />

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

      <div className={`p-6 border-t ${isDarkMode ? 'border-slate-800/50 bg-slate-900/20' : 'border-slate-100 bg-slate-50'}`}>
        <div className={`flex items-center gap-4 p-4 rounded-3xl border shadow-sm ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white shadow-md"><User className="w-6 h-6" /></div>
          <div className="flex-1 overflow-hidden">
            <p className={`text-[11px] font-black truncate uppercase italic leading-none mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Admin Orenstein</p>
            <button className="text-[9px] text-red-500 font-bold uppercase tracking-widest hover:text-red-400 flex items-center gap-1 transition-colors"><LogOut className="w-3 h-3" /> Terminar</button>
          </div>
        </div>
      </div>
    </aside>
  );
}