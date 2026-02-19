import React, { useState, useEffect } from 'react';
import { WORKSPACE_COLORS, WORKSPACE_ICONS } from './workspaceColors';
import { ICON_MAP } from './iconMap';

export default function WsModal({ isDarkMode, isOpen, wsToEdit, onClose, onSave }) {
  const [form, setForm] = useState({ name: '', description: '', icon_key: 'Briefcase', color: 'blue' });

  useEffect(() => {
    if (wsToEdit) {
      setForm({ 
        name: wsToEdit.name, 
        description: wsToEdit.description || '',
        icon_key: wsToEdit.icon_key || 'Briefcase',
        color: wsToEdit.color || 'blue'
      });
    } else {
      setForm({ name: '', description: '', icon_key: 'Briefcase', color: 'blue' });
    }
  }, [wsToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave(form, wsToEdit);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-6">
      <div className={`absolute inset-0 backdrop-blur-md ${isDarkMode ? 'bg-[#020617]/90' : 'bg-slate-900/60'}`} onClick={onClose}></div>
      <div className={`relative w-full h-full sm:h-auto sm:max-w-2xl border-0 sm:border rounded-none sm:rounded-[4rem] shadow-3xl overflow-y-auto ring-1 ring-white/10 ${isDarkMode ? 'bg-slate-900 sm:border-slate-800 shadow-black/50' : 'bg-white sm:border-slate-200 shadow-slate-300'}`}>
        <div className="p-6 sm:p-12 lg:p-16">
          <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-black tracking-tighter uppercase italic mb-3 sm:mb-4 leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{wsToEdit ? 'Refinar Workspace' : 'Materializar Novo Contexto'}</h2>
          <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-8 sm:mb-12">Protocolo de Modificação Orenstein AI</p>
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-10">
            <div className="space-y-4">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">Identificação</label>
              <input type="text" required autoFocus value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className={`w-full border focus:border-blue-500/50 rounded-3xl px-8 py-5 text-sm font-bold outline-none transition-all shadow-inner ${isDarkMode ? 'bg-black/40 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} placeholder="Ex: Monitorização Global" />
            </div>
            <div className="space-y-4">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">Missão Estratégica</label>
              <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className={`w-full border focus:border-blue-500/50 rounded-3xl px-8 py-5 text-sm font-bold outline-none h-32 resize-none shadow-inner ${isDarkMode ? 'bg-black/40 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} placeholder="Propósito..." />
            </div>

            <div className="space-y-6">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">Ícone</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {WORKSPACE_ICONS.map(icon => (
                  <button key={icon} type="button" onClick={() => setForm({...form, icon_key: icon})} className={`p-4 rounded-2xl transition-all border-2 ${form.icon_key === icon ? `${WORKSPACE_COLORS[form.color].bg} border-white/20 text-white shadow-xl scale-105` : (isDarkMode ? 'bg-black/40 border-slate-800 text-slate-500 hover:border-slate-700' : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-300')}`}>
                    {ICON_MAP[icon]}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">Cor</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.keys(WORKSPACE_COLORS).map(colorKey => (
                  <button key={colorKey} type="button" onClick={() => setForm({...form, color: colorKey})} className={`py-4 rounded-2xl transition-all border-2 text-xs font-black uppercase ${form.color === colorKey ? `${WORKSPACE_COLORS[colorKey].bg} border-white/20 text-white shadow-xl scale-105` : (isDarkMode ? `${WORKSPACE_COLORS[colorKey].light} border-slate-800 ${WORKSPACE_COLORS[colorKey].text} hover:scale-105` : `${WORKSPACE_COLORS[colorKey].light} border-slate-200 ${WORKSPACE_COLORS[colorKey].text} hover:scale-105`)}`}>
                    {colorKey}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 sm:gap-4 pt-6 sm:pt-8">
              <button type="button" onClick={onClose} className={`flex-1 px-6 sm:px-8 py-4 sm:py-6 rounded-[2rem] text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all italic ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>Abortar</button>
              <button type="submit" className={`flex-[2] px-8 sm:px-12 py-4 sm:py-6 rounded-[2rem] text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 transition-all ${isDarkMode ? 'bg-white text-slate-950 shadow-white/10' : 'bg-slate-900 text-white shadow-black/10'}`}>Sincronizar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}