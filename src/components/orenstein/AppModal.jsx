import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { ExternalLink } from 'lucide-react';
import TagManager from './TagManager';

export default function AppModal({ isDarkMode, isOpen, appToEdit, onClose, onSave, workspaces, activeWsId }) {
  const [form, setForm] = useState({ name: '', url: '', category: '', description: '', card_summary: '', workspace_id: '', tags: [] });
  const [suggestingResume, setSuggestingResume] = useState(false);
  const [formattingDesc, setFormattingDesc] = useState(false);
  
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
        description: appToEdit.description || '',
        card_summary: appToEdit.card_summary || '',
        workspace_id: appToEdit.workspace_id || activeWsId || '',
        tags: appToEdit.tags || [],
      });
    } else {
      setForm({ name: '', url: '', category: categories[0]?.name || '', description: '', card_summary: '', workspace_id: activeWsId || '', tags: [] });
    }
  }, [appToEdit, isOpen, categories, activeWsId]);

  if (!isOpen) return null;

  const handleSuggestResume = async () => {
    const rawText = form.description?.replace(/<[^>]*>/g, '').trim();
    if (!rawText) return;
    setSuggestingResume(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Você é um UX Writer especialista em interfaces médicas. 
Com base na descrição abaixo de um aplicativo médico, gere um resumo conciso para exibição em um cartão de aplicativo.

Regras obrigatórias:
- Máximo de 80 caracteres
- Foco no benefício direto ao médico (ex: "Evolução SOAP automática em segundos")
- Linguagem humana, não técnica ou robótica
- Sem jargões de IA
- Evite começar com "Um", "O", "A ferramenta"
- Prefira verbos de ação no presente

Descrição:
"${rawText}"

Retorne APENAS o resumo, sem aspas, sem explicação.`,
    });
    const summary = typeof result === 'string' ? result.trim() : '';
    setForm(f => ({ ...f, card_summary: summary.slice(0, 80) }));
    setSuggestingResume(false);
  };

  const handleFormatDescription = async () => {
    const rawText = form.description?.replace(/<[^>]*>/g, '').trim();
    if (!rawText) return;
    setFormattingDesc(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Você é um especialista em UX Writing e design de interfaces de alta performance para sistemas médicos.

Converta o texto abaixo em HTML estruturado, aplicando hierarquia visual clara e espaçamento legível.

Regras obrigatórias:
- Use <h2 class="text-lg font-black uppercase tracking-wide mb-3 mt-6 first:mt-0"> para seções principais
- Use <h3 class="text-sm font-black uppercase tracking-widest mb-2 mt-4 opacity-70"> para subseções
- Use <p class="text-sm leading-relaxed mb-4"> para parágrafos
- Use <ul class="space-y-2 mb-4 ml-2"> com <li class="flex items-start gap-2 text-sm leading-relaxed"><span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-current flex-shrink-0 opacity-60"></span><span> para listas com bullet
- Use <strong class="font-black"> para destacar termos-chave
- O elemento mais importante deve vir PRIMEIRO (pirâmide invertida)
- Omita qualquer texto introdutório ou explicação — retorne APENAS o HTML

Texto:
"${rawText}"

Retorne APENAS o HTML estruturado, sem markdown, sem blocos de código, sem explicação.`,
    });
    const html = typeof result === 'string' ? result.trim() : '';
    if (html) setForm(f => ({ ...f, description: html }));
    setFormattingDesc(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.url.trim()) return;
    onSave({
      title: form.name,
      url: form.url.startsWith('http') ? form.url : `https://${form.url}`,
      category: form.category,
      description: form.description || "Ativo materializado na rede Orenstein AI.",
      card_summary: form.card_summary || '',
      workspace_id: form.workspace_id,
      tags: form.tags || [],
    }, appToEdit);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-6">
      <div className={`absolute inset-0 backdrop-blur-md ${isDarkMode ? 'bg-[#020617]/90' : 'bg-slate-900/60'}`} onClick={onClose}></div>
      <div className={`relative w-full h-full sm:h-auto sm:max-w-6xl border-0 sm:border rounded-none sm:rounded-[4rem] shadow-3xl overflow-y-auto ring-1 ring-white/10 ${isDarkMode ? 'bg-slate-900 sm:border-slate-800 shadow-black/50' : 'bg-white sm:border-slate-200 shadow-slate-300'}`}>
        <div className="p-6 sm:p-12 lg:p-16 overflow-y-auto max-h-[90vh] custom-scrollbar">
          <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-black tracking-tighter uppercase italic mb-8 sm:mb-12 leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{appToEdit ? 'Editar Aplicativo' : 'Adicionar Aplicativo'}</h2>
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
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
              <div className="flex items-center justify-between px-1">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Descrição Detalhada</label>
                <button
                  type="button"
                  onClick={handleFormatDescription}
                  disabled={formattingDesc || !form.description?.replace(/<[^>]*>/g, '').trim()}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                    formattingDesc
                      ? (isDarkMode ? 'bg-violet-500/10 border-violet-500/20 text-violet-400 animate-pulse' : 'bg-violet-50 border-violet-200 text-violet-400 animate-pulse')
                      : (isDarkMode ? 'bg-violet-500/10 border-violet-500/20 text-violet-400 hover:bg-violet-500 hover:text-white' : 'bg-violet-50 border-violet-100 text-violet-600 hover:bg-violet-600 hover:text-white')
                  } disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  🧠 {formattingDesc ? 'Formatando…' : 'Formatar com IA'}
                </button>
              </div>
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
            {/* Resumo do Cartão */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Resumo do Cartão</label>
                <button
                  type="button"
                  onClick={handleSuggestResume}
                  disabled={suggestingResume || !form.description?.replace(/<[^>]*>/g, '').trim()}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                    suggestingResume
                      ? (isDarkMode ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 animate-pulse' : 'bg-indigo-50 border-indigo-200 text-indigo-400 animate-pulse')
                      : (isDarkMode ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 hover:bg-indigo-500 hover:text-white' : 'bg-indigo-50 border-indigo-100 text-indigo-600 hover:bg-indigo-600 hover:text-white')
                  } disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  ✨ {suggestingResume ? 'Gerando…' : 'Sugerir Resumo'}
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  maxLength={80}
                  value={form.card_summary}
                  onChange={(e) => setForm({ ...form, card_summary: e.target.value.slice(0, 80) })}
                  placeholder="Ex: Evolução SOAP automática em segundos"
                  className={`w-full border focus:border-indigo-500/50 rounded-3xl px-8 py-5 text-sm font-bold outline-none transition-all shadow-inner pr-16 ${isDarkMode ? 'bg-black/40 border-slate-800 text-white placeholder:text-slate-600' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'}`}
                />
                <span className={`absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black tabular-nums ${form.card_summary.length >= 75 ? 'text-amber-500' : (isDarkMode ? 'text-slate-600' : 'text-slate-400')}`}>
                  {form.card_summary.length}/80
                </span>
              </div>
              {form.card_summary && (
                <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl border text-xs font-medium ${isDarkMode ? 'bg-slate-800/60 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                  <span className={`text-[9px] font-black uppercase tracking-widest flex-shrink-0 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Preview</span>
                  <span className="line-clamp-1">{form.card_summary}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="space-y-4">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">Tags</label>
              <TagManager
                isDarkMode={isDarkMode}
                tags={form.tags}
                onChange={(tags) => setForm(f => ({ ...f, tags }))}
                suggestedTags={[]}
              />
            </div>

            <div className="space-y-6">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">Workspace</label>
              {workspaces?.length === 0 ? (
                <p className={`text-sm italic ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Nenhum workspace disponível.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  {workspaces?.map(ws => (
                    <button key={ws.id} type="button" onClick={() => setForm({...form, workspace_id: ws.id})} className={`py-5 rounded-3xl text-[10px] font-black uppercase tracking-tighter transition-all border-2 ${form.workspace_id === ws.id ? 'bg-blue-600 border-blue-400 text-white shadow-xl scale-105' : isDarkMode ? 'bg-black/40 border-slate-800 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-300'}`}>{ws.name}</button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">Setor Operacional</label>
              {categories.length === 0 ? (
                <p className={`text-sm italic ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Nenhuma categoria criada. Configure-as em Gestão Workspaces.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  {categories.map(cat => (
                    <button key={cat.id} type="button" onClick={() => setForm({...form, category: cat.name})} className={`py-5 rounded-3xl text-[10px] font-black uppercase tracking-tighter transition-all border-2 ${form.category === cat.name ? 'bg-blue-600 border-blue-400 text-white shadow-xl scale-105' : isDarkMode ? 'bg-black/40 border-slate-800 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-300'}`}>{cat.name}</button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-3 sm:gap-4 pt-6 sm:pt-8">
              <button type="button" onClick={onClose} className={`flex-1 px-6 sm:px-8 py-4 sm:py-6 rounded-[2rem] text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all italic ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>Abortar</button>
              <button type="submit" className={`flex-[2] px-8 sm:px-12 py-4 sm:py-6 rounded-[2rem] text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 transition-all ${isDarkMode ? 'bg-white text-slate-950 shadow-white/10' : 'bg-slate-900 text-white shadow-black/10'}`}>Sincronizar</button>
            </div>
            {form.url && (
              <a
                href={form.url.startsWith('http') ? form.url : `https://${form.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-2 w-full py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all border hover:scale-105 active:scale-95 ${isDarkMode ? 'border-blue-500/20 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white' : 'border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white'}`}
              >
                <ExternalLink className="w-4 h-4" /> Acessar Aplicativo
              </a>
            )}
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