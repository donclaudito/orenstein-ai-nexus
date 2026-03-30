import React from 'react';
import { ChevronUp, ChevronDown, Star, MoveRight, GripVertical } from 'lucide-react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { ICON_MAP } from './iconMap';
import { WORKSPACE_COLORS } from './workspaceColors';

const encodeDropId = (wsId, catName) => `apps|${wsId}|${catName}`;

export default function SortableWorkspaceItem({
  ws,
  wsIndex,
  totalWs,
  isDarkMode,
  isActive,
  isWsCollapsed,
  activeApp,
  categories,
  appsMap,
  draggingOverKey,
  onSelectWs,
  onToggleCollapse,
  onReorderUp,
  onReorderDown,
  onSelectApp,
}) {
  const WsIcon = ICON_MAP[ws.icon_key] || ICON_MAP['Briefcase'];
  const wsColor = WORKSPACE_COLORS[ws.color || 'blue'];

  return (
    <div className="space-y-1">
      {/* Workspace header row */}
      <div className="flex items-center gap-1">
        {/* Up/Down reorder buttons */}
        <div className="flex flex-col gap-0.5 p-1 flex-shrink-0">
          <button
            onClick={onReorderUp}
            disabled={wsIndex === 0}
            className={`p-0.5 rounded transition-colors ${
              wsIndex === 0
                ? 'opacity-20 cursor-not-allowed'
                : isDarkMode
                ? 'text-slate-600 hover:text-slate-400'
                : 'text-slate-300 hover:text-slate-500'
            }`}
          >
            <ChevronUp className="w-3 h-3" />
          </button>
          <button
            onClick={onReorderDown}
            disabled={wsIndex === totalWs - 1}
            className={`p-0.5 rounded transition-colors ${
              wsIndex === totalWs - 1
                ? 'opacity-20 cursor-not-allowed'
                : isDarkMode
                ? 'text-slate-600 hover:text-slate-400'
                : 'text-slate-300 hover:text-slate-500'
            }`}
          >
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>

        {/* Workspace selector button */}
        <button
          onClick={() => onSelectWs(ws.id)}
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

        {/* Collapse toggle */}
        <button
          onClick={onToggleCollapse}
          className={`p-1.5 rounded-xl flex-shrink-0 transition-colors ${
            isDarkMode ? 'text-slate-600 hover:text-slate-400' : 'text-slate-300 hover:text-slate-500'
          }`}
          title={isWsCollapsed ? 'Expandir' : 'Recolher'}
        >
          {isWsCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Category + draggable apps */}
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
                    ? isDarkMode ? 'text-blue-400 bg-blue-500/10' : 'text-blue-600 bg-blue-50'
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
                          ? isDarkMode ? 'rgba(59,130,246,0.07)' : 'rgba(59,130,246,0.05)'
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
                                opacity: appSnap.isDragging ? 0.92 : 1,
                                boxShadow: appSnap.isDragging
                                  ? isDarkMode
                                    ? '0 0 0 2px rgba(99,102,241,0.9), 0 24px 48px -8px rgba(99,102,241,0.5), 0 8px 20px rgba(0,0,0,0.5)'
                                    : '0 0 0 2px rgba(59,130,246,0.8), 0 24px 48px -8px rgba(59,130,246,0.35), 0 8px 20px rgba(0,0,0,0.12)'
                                  : undefined,
                                borderRadius: '1rem',
                                background: appSnap.isDragging
                                  ? isDarkMode ? '#1e2a3a' : '#eef4ff'
                                  : undefined,
                                transform: appSnap.isDragging
                                  ? `${appDrag.draggableProps.style?.transform ?? ''} scale(1.03)`
                                  : appDrag.draggableProps.style?.transform,
                              }}
                              className="flex items-center gap-1 group/approw"
                            >
                              {/* Drag handle */}
                              <div
                                {...appDrag.dragHandleProps}
                                style={{ cursor: appSnap.isDragging ? 'grabbing' : 'grab' }}
                                className={`flex-shrink-0 p-1.5 rounded-xl opacity-0 group-hover/approw:opacity-100 transition-opacity ${
                                  isDarkMode ? 'text-slate-600 hover:text-slate-400' : 'text-slate-300 hover:text-slate-500'
                                }`}
                                title="Arrastar — pode mover entre categorias e workspaces"
                              >
                                <GripVertical className="w-3 h-3" />
                              </div>

                              {/* App button */}
                              <button
                                onClick={() => onSelectApp(app, ws.id)}
                                className={`flex-1 flex items-center gap-3 px-3 py-2 rounded-2xl text-[10px] font-bold uppercase transition-all ${
                                  activeApp?.id === app.id
                                    ? isDarkMode
                                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-sm'
                                      : 'bg-blue-50 text-blue-600 border border-blue-100 shadow-sm'
                                    : isDarkMode
                                    ? 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
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
}