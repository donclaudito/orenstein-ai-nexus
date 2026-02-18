import React, { useState, useEffect } from 'react';

export default function WsModal({ isDarkMode, isOpen, wsToEdit, onClose, onSave }) {
  const [form, setForm] = useState({ name: '', description: '' });

  useEffect(() => {
    if (wsToEdit) {
      setForm({ name: wsToEdit.name, description: wsToEdit.description || '' });
    } else {
      setForm({ name: '', description: '' });
    }
  }, [wsToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave(form, wsToEdit);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className={`absolute inset-0 backdrop-blur-md ${isDarkMode ? 'bg-[#020617]/90' : 'bg-slate-900/60'}`} onClick={onClose}></div>
      <div className={`relative w-full max-w-2xl border rounded-[4rem] shadow-3xl overflow-hidden ring-1 ring-white/10 ${isDarkMode ? 'bg-slate-900 border-slate-800 shadow-black/50' : 'bg-white border-slate-200 shadow-slate-300'}`}>
        <div className="p-16">
          <h2 className={`text-4xl font-black tracking-tighter uppercase italic mb-4 leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{wsToEdit ? 'Refinar Workspace' : 'Materializar Novo Contexto'}</h2>
          <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-12">Protocolo de Modificação Orenstein AI</p>
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-4">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">Identificação</label>
              <input type="text" required autoFocus value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className={`w-full border focus:border-blue-500/50 rounded-3xl px-8 py-5 text-sm font-bold outline-none transition-all shadow-inner ${isDarkMode ? 'bg-black/40 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} placeholder="Ex: Monitorização Global" />
            </div>
            <div className="space-y-4">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">Missão Estratégica</label>
              <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className={`w-full border focus:border-blue-500/50 rounded-3xl px-8 py-5 text-sm font-bold outline-none h-32 resize-none shadow-inner ${isDarkMode ? 'bg-black/40 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} placeholder="Propósito..." />
            </div>
            <div className="flex gap-4 pt-8">
              <button type="button" onClick={onClose} className={`flex-1 px-8 py-6 rounded-[2rem] text-xs font-black uppercase tracking-widest transition-all italic ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>Abortar</button>
              <button type="submit" className={`flex-[2] px-12 py-6 rounded-[2rem] text-xs font-black uppercase tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 transition-all ${isDarkMode ? 'bg-white text-slate-950 shadow-white/10' : 'bg-slate-900 text-white shadow-black/10'}`}>Sincronizar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}