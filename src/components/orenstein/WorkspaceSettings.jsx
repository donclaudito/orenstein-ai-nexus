import React, { useState } from 'react';
import { Pencil, Trash2, Box, Star, GripVertical, LayoutList, ChevronUp, ChevronDown, GripHorizontal } from 'lucide-react';
import { ICON_MAP } from './iconMap';
import { WORKSPACE_COLORS } from './workspaceColors';
import SubMenuOrderModal from './SubMenuOrderModal';

export default function WorkspaceSettings({
  isDarkMode,
  workspaces,
  activeWsId,
  apps = [],
  onEdit,
  onDelete,
  onCreateNew,
  onToggleFavorite,
  onReorder,
  onToggleActive,
}) {
  const [subMenuWs, setSubMenuWs] = useState(null);
  const [draggingIdx, setDraggingIdx] = useState(null);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-end justify-end mb-12">
        <button
          onClick={onCreateNew}
          className={`flex items-center gap-3 px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-xl hover:scale-105 active:scale-95 ${isDarkMode ? 'bg-white text-slate-950 shadow-white/5' : 'bg-slate-900 text-white shadow-black/10'}`}
        >
          <Box className="w-4 h-4" /> Criar Novo Workspace
        </button>
      </div>

      <div className={`backdrop-blur-xl rounded-[3rem] border overflow-hidden shadow-2xl ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-slate-200'}`}>
        <table className="w-full text-left font-bold">
          <thead className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDarkMode ? 'bg-slate-950/50 text-slate-500' : 'bg-slate-50 text-slate-400'}`}>
            <tr>
              <th className="px-6 py-6 w-12"></th>
              <th className="px-6 py-6">Workspace</th>
              <th className="px-6 py-6">Propósito</th>
              <th className="px-6 py-6 text-center">Status</th>
              <th className="px-6 py-6 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
            {workspaces.map((ws, index) => {
              const wsColor = WORKSPACE_COLORS[ws.color || 'blue'];
              const WsIcon = ICON_MAP[ws.icon_key] || <Box className="w-5 h-5" />;
              const isActive = ws.is_active !== false;
              const isDraggingThis = draggingIdx === index;

              return (
                <tr
                  key={ws.id}
                  className={`group transition-all duration-200 ${!isActive ? 'opacity-50' : ''} ${
                    isDraggingThis
                      ? isDarkMode
                        ? 'bg-indigo-500/10 shadow-[0_8px_32px_-4px_rgba(99,102,241,0.4)] scale-[1.01]'
                        : 'bg-blue-50 shadow-[0_8px_32px_-4px_rgba(59,130,246,0.25)] scale-[1.01]'
                      : isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'
                  }`}
                  style={{ transform: isDraggingThis ? 'translateY(-2px)' : undefined, transition: 'all 0.2s ease' }}
                >
                  {/* Reorder */}
                  <td className="px-6 py-8">
                    <div className="flex flex-col gap-1 items-center">
                      <button
                        onClick={() => { onReorder(index, index - 1); }}
                        disabled={index === 0}
                        className={`p-1.5 rounded-lg transition-all ${index === 0 ? 'opacity-20 cursor-not-allowed' : (isDarkMode ? 'text-slate-500 hover:text-slate-300 hover:bg-white/5' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100')}`}
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <div
                        title="Arrastar para reordenar"
                        onMouseDown={() => setDraggingIdx(index)}
                        onMouseUp={() => setDraggingIdx(null)}
                        onMouseLeave={() => setDraggingIdx(null)}
                        style={{ cursor: isDraggingThis ? 'grabbing' : 'grab' }}
                        className={`p-1 rounded transition-colors ${isDarkMode ? 'text-slate-600 hover:text-slate-400' : 'text-slate-300 hover:text-slate-500'}`}
                      >
                        <GripVertical className="w-4 h-4" />
                      </div>
                      <button
                        onClick={() => { onReorder(index, index + 1); }}
                        disabled={index === workspaces.length - 1}
                        className={`p-1.5 rounded-lg transition-all ${index === workspaces.length - 1 ? 'opacity-20 cursor-not-allowed' : (isDarkMode ? 'text-slate-500 hover:text-slate-300 hover:bg-white/5' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100')}`}
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                  {/* Workspace name */}
                  <td className="px-6 py-8">
                    <div className="flex items-center gap-5">
                      <div className={`p-3.5 rounded-2xl shadow-lg border-2 ${wsColor.bg} border-white/20 text-white flex-shrink-0`}>
                        {WsIcon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className={`font-black text-base uppercase italic tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{ws.name}</p>
                          <button
                            onClick={() => onToggleFavorite(ws.id, !ws.is_favorite)}
                            className={`p-1 rounded-lg transition-all ${ws.is_favorite ? 'text-amber-500' : (isDarkMode ? 'text-slate-600 hover:text-amber-500' : 'text-slate-300 hover:text-amber-500')}`}
                            title={ws.is_favorite ? 'Remover dos favoritos' : 'Favoritar'}
                          >
                            <Star className={`w-3.5 h-3.5 ${ws.is_favorite ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                        {activeWsId === ws.id && (
                          <div className="flex items-center gap-1.5 mt-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em]">Selecionado</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Propósito */}
                  <td className={`px-6 py-8 text-xs font-medium max-w-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {ws.description || <span className="opacity-30 italic">Sem descrição</span>}
                  </td>

                  {/* Toggle Ativo/Inativo */}
                  <td className="px-6 py-8 text-center">
                    <button
                      onClick={() => onToggleActive?.(ws.id, !isActive)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full border-2 transition-all duration-300 ${
                        isActive
                          ? 'bg-emerald-500 border-emerald-400'
                          : (isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-200 border-slate-300')
                      }`}
                      title={isActive ? 'Desativar workspace' : 'Ativar workspace'}
                    >
                      <span className={`inline-block h-4 w-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${isActive ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                    <p className={`text-[9px] font-black uppercase tracking-widest mt-1.5 ${isActive ? 'text-emerald-500' : (isDarkMode ? 'text-slate-600' : 'text-slate-400')}`}>
                      {isActive ? 'Ativo' : 'Inativo'}
                    </p>
                  </td>

                  {/* Ações */}
                  <td className="px-6 py-8">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSubMenuWs(ws)}
                        className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl transition-all border text-[9px] font-black uppercase tracking-widest ${isDarkMode ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500 hover:text-white' : 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-600 hover:text-white shadow-sm'}`}
                        title="Organizar submenus"
                      >
                        <LayoutList className="w-3.5 h-3.5" />
                        <span className="hidden xl:inline">Submenus</span>
                      </button>
                      <button
                        onClick={(e) => onEdit(e, ws)}
                        className={`p-3 rounded-xl transition-all border ${isDarkMode ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500 hover:text-white' : 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-600 hover:text-white shadow-sm'}`}
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => onDelete(e, ws.id)}
                        disabled={workspaces.length <= 1}
                        className={`p-3 rounded-xl transition-all border ${workspaces.length > 1 ? (isDarkMode ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500 hover:text-white' : 'bg-red-50 text-red-600 border-red-100 hover:bg-red-600 hover:text-white shadow-sm') : (isDarkMode ? 'bg-slate-800 text-slate-600 border-slate-700 cursor-not-allowed' : 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed')}`}
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* SubMenu Order Modal */}
      {subMenuWs && (
        <SubMenuOrderModal
          isDarkMode={isDarkMode}
          workspace={subMenuWs}
          apps={apps}
          onClose={() => setSubMenuWs(null)}
        />
      )}
    </div>
  );
}