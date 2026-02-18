import React from 'react';
import { Pencil, Trash2, Box } from 'lucide-react';
import { ICON_MAP } from './iconMap';

export default function WorkspaceSettings({ isDarkMode, workspaces, activeWsId, onEdit, onDelete, onCreateNew }) {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-end justify-between mb-12">
        <div>
          <h2 className={`text-5xl font-black tracking-tighter uppercase italic mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Configurações</h2>
          <p className="text-blue-500 font-black text-[10px] uppercase tracking-[0.4em]">Gestão de Contextos Operacionais</p>
        </div>
        <button onClick={onCreateNew} className={`flex items-center gap-3 px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-xl hover:scale-105 active:scale-95 ${isDarkMode ? 'bg-white text-slate-950 shadow-white/5' : 'bg-slate-900 text-white shadow-black/10'}`}>
          <Box className="w-4 h-4" /> Materializar Novo Contexto
        </button>
      </div>

      <div className={`backdrop-blur-xl rounded-[3rem] border overflow-hidden shadow-2xl ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-slate-200'}`}>
        <table className="w-full text-left font-bold">
          <thead className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDarkMode ? 'bg-slate-950/50 text-slate-500' : 'bg-slate-50 text-slate-400'}`}>
            <tr><th className="px-12 py-8">Workspace</th><th className="px-12 py-8">Propósito</th><th className="px-12 py-8 text-right">Ações</th></tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
            {workspaces.map(ws => (
              <tr key={ws.id} className={`group transition-all ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                <td className="px-12 py-10">
                  <div className="flex items-center gap-6">
                    <div className={`p-4 rounded-2xl shadow-inner border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-blue-400' : 'bg-slate-50 border-slate-200 text-blue-600'}`}>{ICON_MAP[ws.icon_key] || <Box className="w-5 h-5" />}</div>
                    <div>
                      <p className={`font-black text-lg uppercase italic tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{ws.name}</p>
                      {activeWsId === ws.id && <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em] mt-2 block flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Ativo</span>}
                    </div>
                  </div>
                </td>
                <td className={`px-12 py-10 text-sm font-medium max-w-md leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{ws.description}</td>
                <td className="px-12 py-10 text-right">
                  <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={(e) => onEdit(e, ws)} className={`p-4 rounded-2xl transition-all border ${isDarkMode ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500' : 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-600 hover:text-white shadow-sm'}`}><Pencil className="w-5 h-5" /></button>
                    <button onClick={(e) => onDelete(e, ws.id)} className={`p-4 rounded-2xl transition-all border ${workspaces.length > 1 ? (isDarkMode ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500 shadow-red-500/10' : 'bg-red-50 text-red-600 border-red-100 hover:bg-red-600 hover:text-white shadow-sm') : (isDarkMode ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-slate-100 text-slate-300 cursor-not-allowed')}`} disabled={workspaces.length <= 1}><Trash2 className="w-5 h-5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}