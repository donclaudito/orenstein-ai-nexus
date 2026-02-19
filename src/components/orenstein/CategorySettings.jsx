import React, { useState } from 'react';
import { Pencil, Trash2, Plus, GripVertical } from 'lucide-react';
import { ICON_MAP } from './iconMap';
import { WORKSPACE_COLORS, WORKSPACE_ICONS } from './workspaceColors';

export default function CategorySettings({ isDarkMode, categories, onEdit, onDelete, onCreateNew, onReorder }) {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-end justify-end mb-12">
        <button onClick={onCreateNew} className={`flex items-center gap-3 px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-xl hover:scale-105 active:scale-95 ${isDarkMode ? 'bg-white text-slate-950 shadow-white/5' : 'bg-slate-900 text-white shadow-black/10'}`}>
          <Plus className="w-4 h-4" /> Criar Nova Categoria
        </button>
      </div>

      <div className={`backdrop-blur-xl rounded-[3rem] border overflow-hidden shadow-2xl ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-slate-200'}`}>
        <table className="w-full text-left font-bold">
          <thead className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDarkMode ? 'bg-slate-950/50 text-slate-500' : 'bg-slate-50 text-slate-400'}`}>
            <tr><th className="px-8 py-8 w-12"></th><th className="px-8 py-8">Categoria</th><th className="px-8 py-8 text-right">Ações</th></tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
            {categories.map((cat, index) => {
              const catColor = WORKSPACE_COLORS[cat.color || 'blue'];
              const CatIcon = ICON_MAP[cat.icon_key] || ICON_MAP['Package'];
              return (
              <tr key={cat.id} className={`group transition-all ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                <td className="px-8 py-10">
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => onReorder(index, index - 1)} 
                      disabled={index === 0}
                      className={`p-2 rounded-lg transition-all ${index === 0 ? 'opacity-20 cursor-not-allowed' : (isDarkMode ? 'text-slate-500 hover:text-slate-300 hover:bg-white/5' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100')}`}
                    >
                      <GripVertical className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onReorder(index, index + 1)} 
                      disabled={index === categories.length - 1}
                      className={`p-2 rounded-lg transition-all ${index === categories.length - 1 ? 'opacity-20 cursor-not-allowed' : (isDarkMode ? 'text-slate-500 hover:text-slate-300 hover:bg-white/5' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100')}`}
                    >
                      <GripVertical className="w-4 h-4 rotate-180" />
                    </button>
                  </div>
                </td>
                <td className="px-8 py-10">
                  <div className="flex items-center gap-6">
                    <div className={`p-4 rounded-2xl shadow-lg border-2 ${catColor.bg} border-white/20 text-white`}>
                      {CatIcon}
                    </div>
                    <p className={`font-black text-lg uppercase italic tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{cat.name}</p>
                  </div>
                </td>
                <td className="px-8 py-10 text-right">
                  <div className="flex items-center justify-end gap-3 transition-all">
                    <button onClick={(e) => onEdit(e, cat)} className={`p-4 rounded-2xl transition-all border ${isDarkMode ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500 hover:text-white' : 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-600 hover:text-white shadow-sm'}`}><Pencil className="w-5 h-5" /></button>
                    <button onClick={(e) => onDelete(e, cat.id)} className={`p-4 rounded-2xl transition-all border ${isDarkMode ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500 hover:text-white shadow-red-500/10' : 'bg-red-50 text-red-600 border-red-100 hover:bg-red-600 hover:text-white shadow-sm'}`}><Trash2 className="w-5 h-5" /></button>
                  </div>
                </td>
              </tr>
            );})}
          </tbody>
        </table>
      </div>
    </div>
  );
}