import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

export default function AppModal({ isDarkMode, isOpen, appToEdit, onClose, onSave }) {
  const [form, setForm] = useState({ name: '', url: '', category: '', description: '' });
  
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => base44.entities.Category.list('order_index'),
    initialData: [],
  });

  useEffect(() => {
    if (appToEdit) {
      setForm({ 
        name: appToEdit.title, 
        url: appToEdit.url, 
        category: appToEdit.category,
        description: appToEdit.description || ''
      });
    } else {
      setForm({ name: '', url: '', category: categories[0]?.name || '', description: '' });
    }
  }, [appToEdit, isOpen, categories]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.url.trim()) return;
    onSave({
      title: form.name,
      url: form.url.startsWith('http') ? form.url : `https://${form.url}`,
      category: form.category,
      description: form.description || "Ativo materializado na rede Orenstein AI."
    }, appToEdit);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className={`absolute inset-0 backdrop-blur-md ${isDarkMode ? 'bg-[#020617]/90' : 'bg-slate-900/60'}`} onClick={onClose}></div>
      <div className={`relative w-full max-w-2xl border rounded-[4rem] shadow-3xl overflow-hidden ring-1 ring-white/10 ${isDarkMode ? 'bg-slate-900 border-slate-800 shadow-black/50' : 'bg-white border-slate-200 shadow-slate-300'}`}>
        <div className="p-16">
          <h2 className={`text-4xl font-black tracking-tighter uppercase italic mb-12 leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{appToEdit ? 'Editar Aplicativo' : 'Adicionar Aplicativo'}</h2>
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">Identificação</label>
                <input type="text" required autoFocus value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className={`w-full border focus:border-blue-500/50 rounded-3xl px-8 py-5 text-sm font-bold outline-none transition-all shadow-inner ${isDarkMode ? 'bg-black/40 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} />
              </div>
              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">URL Destino</label>
                <input type="text" required value={form.url} onChange={(e) => setForm({...form, url: e.target.value})} className={`w-full border focus:border-blue-500/50 rounded-3xl px-8 py-5 text-sm font-bold outline-none transition-all shadow-inner ${isDarkMode ? 'bg-black/40 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} />
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">Descrição Detalhada</label>
              <div className={`rounded-3xl overflow-hidden border ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                <ReactQuill
                  theme="snow"
                  value={form.description}
                  onChange={(value) => setForm({...form, description: value})}
                  className={isDarkMode ? 'quill-dark' : ''}
                  modules={{
                    toolbar: [
                      ['bold', 'italic', 'underline'],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      ['link'],
                      ['clean']
                    ]
                  }}
                />
              </div>
            </div>
            <div className="space-y-6">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">Setor Operacional</label>
              {categories.length === 0 ? (
                <p className={`text-sm italic ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Nenhuma categoria criada. Configure-as em Gestão Workspaces.</p>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {categories.map(cat => (
                    <button key={cat.id} type="button" onClick={() => setForm({...form, category: cat.name})} className={`py-5 rounded-3xl text-[10px] font-black uppercase tracking-tighter transition-all border-2 ${form.category === cat.name ? 'bg-blue-600 border-blue-400 text-white shadow-xl scale-105' : isDarkMode ? 'bg-black/40 border-slate-800 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-300'}`}>{cat.name}</button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-4 pt-8">
              <button type="button" onClick={onClose} className={`flex-1 px-8 py-6 rounded-[2rem] text-xs font-black uppercase tracking-widest transition-all italic ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>Abortar</button>
              <button type="submit" className={`flex-[2] px-12 py-6 rounded-[2rem] text-xs font-black uppercase tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 transition-all ${isDarkMode ? 'bg-white text-slate-950 shadow-white/10' : 'bg-slate-900 text-white shadow-black/10'}`}>Sincronizar</button>
            </div>
          </form>
        </div>
      </div>
      <style>{`
        .quill-dark .ql-toolbar {
          background: rgba(0, 0, 0, 0.4);
          border: none;
          border-bottom: 1px solid rgb(30, 41, 59);
        }
        .quill-dark .ql-container {
          background: rgba(0, 0, 0, 0.4);
          color: white;
          border: none;
        }
        .quill-dark .ql-editor.ql-blank::before {
          color: rgb(100, 116, 139);
        }
        .quill-dark .ql-stroke {
          stroke: rgb(148, 163, 184);
        }
        .quill-dark .ql-fill {
          fill: rgb(148, 163, 184);
        }
        .quill-dark .ql-picker-label {
          color: rgb(148, 163, 184);
        }
        .ql-editor {
          min-height: 150px;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}