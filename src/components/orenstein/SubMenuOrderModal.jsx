import React, { useState, useEffect } from 'react';
import { X, GripVertical, LayoutList } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { base44 } from '@/api/base44Client';
import { useQueryClient } from '@tanstack/react-query';

export default function SubMenuOrderModal({ isDarkMode, workspace, apps, onClose }) {
  const queryClient = useQueryClient();
  const wsApps = apps
    .filter(a => a.workspace_id === workspace.id && !a.is_archived)
    .sort((a, b) => (a.order_index ?? 999) - (b.order_index ?? 999));

  const [localApps, setLocalApps] = useState(wsApps);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLocalApps(
      apps
        .filter(a => a.workspace_id === workspace.id && !a.is_archived)
        .sort((a, b) => (a.order_index ?? 999) - (b.order_index ?? 999))
    );
  }, [apps, workspace.id]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = [...localApps];
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setLocalApps(reordered);
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const updates = localApps.map((app, idx) =>
      base44.entities.AppAsset.update(app.id, { order_index: idx })
    );
    await Promise.all(updates);
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ['apps'] });
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 400);
  };

  const exportJSON = () => {
    const payload = localApps.map((app, idx) => ({
      id: app.id,
      title: app.title,
      order_index: idx,
      is_archived: app.is_archived ?? false,
    }));
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `submenu_${workspace.name.replace(/\s+/g, '_').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className={`relative w-full max-w-lg rounded-[2rem] border shadow-2xl overflow-hidden ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-8 py-6 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
          <div className="flex items-center gap-3">
            <LayoutList className="w-5 h-5 text-blue-500" />
            <div>
              <h3 className={`text-sm font-black uppercase italic tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Organizar Submenus
              </h3>
              <p className={`text-[10px] font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                {workspace.name} — arraste para reordenar
              </p>
            </div>
          </div>
          <button onClick={onClose} className={`p-2.5 rounded-xl transition-all ${isDarkMode ? 'text-slate-500 hover:text-white hover:bg-white/5' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'}`}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drag list */}
        <div className="px-6 py-4 max-h-[50vh] overflow-y-auto">
          {localApps.length === 0 ? (
            <p className={`text-center py-12 text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
              Nenhum aplicativo neste workspace
            </p>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="submenu-order">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
                    {localApps.map((app, idx) => (
                      <Draggable key={app.id} draggableId={app.id} index={idx}>
                        {(drag, snap) => (
                          <div
                            ref={drag.innerRef}
                            {...drag.draggableProps}
                            style={{
                              ...drag.draggableProps.style,
                              opacity: snap.isDragging ? 0.85 : 1,
                              boxShadow: snap.isDragging ? '0 8px 24px rgba(59,130,246,0.3)' : undefined,
                              borderRadius: '1rem',
                            }}
                            className={`flex items-center gap-3 px-4 py-3.5 border transition-all ${isDarkMode
                              ? (snap.isDragging ? 'bg-slate-800 border-blue-500/40' : 'bg-slate-800/60 border-slate-700 hover:border-slate-600')
                              : (snap.isDragging ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200 hover:border-slate-300')
                            }`}
                          >
                            <div
                              {...drag.dragHandleProps}
                              className={`cursor-grab active:cursor-grabbing p-1 ${isDarkMode ? 'text-slate-600 hover:text-slate-400' : 'text-slate-300 hover:text-slate-500'}`}
                            >
                              <GripVertical className="w-4 h-4" />
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest w-6 text-center ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`}>
                              {idx + 1}
                            </span>
                            <span className={`flex-1 text-xs font-bold truncate ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                              {app.title}
                            </span>
                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${isDarkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-200 text-slate-500'}`}>
                              {app.category}
                            </span>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-between gap-3 px-8 py-5 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
          <button
            onClick={exportJSON}
            className={`text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-full border transition-all ${isDarkMode ? 'border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white' : 'border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-800'}`}
          >
            Exportar JSON
          </button>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className={`text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-full border transition-all ${isDarkMode ? 'border-slate-700 text-slate-400 hover:text-white' : 'border-slate-200 text-slate-500 hover:text-slate-800'}`}>
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-full transition-all shadow-lg ${
                saved
                  ? 'bg-emerald-500 text-white'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20'
              } disabled:opacity-60`}
            >
              {saving ? 'Salvando…' : saved ? 'Salvo!' : 'Salvar Ordem'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}