import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function KernelNotes({ isDarkMode }) {
  const queryClient = useQueryClient();
  const [content, setContent] = useState('');

  const { data: notes } = useQuery({
    queryKey: ['kernelNotes'],
    queryFn: () => base44.entities.KernelNote.list('-updated_date', 1),
    initialData: [],
  });

  const saveMutation = useMutation({
    mutationFn: async (text) => {
      if (notes && notes.length > 0) {
        return base44.entities.KernelNote.update(notes[0].id, { content: text });
      } else {
        return base44.entities.KernelNote.create({ content: text });
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['kernelNotes'] }),
  });

  useEffect(() => {
    if (notes && notes.length > 0 && content === '') {
      setContent(notes[0].content || '');
    }
  }, [notes]);

  // Auto-save with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (content) {
        saveMutation.mutate(content);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [content]);

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col">
      <h2 className={`text-4xl font-black italic uppercase tracking-tighter mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Logs de Kernel</h2>
      <p className="text-amber-500 text-[10px] font-black uppercase tracking-[0.4em] mb-12 italic">Registo Estratégico</p>
      <div className={`backdrop-blur-xl border rounded-[4rem] p-16 shadow-2xl flex-1 flex flex-col group transition-all ring-1 ring-white/5 ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-slate-200'}`}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={`flex-1 bg-transparent border-none focus:ring-0 outline-none resize-none text-lg font-medium leading-loose italic custom-scrollbar ${isDarkMode ? 'placeholder:text-slate-700 text-slate-300' : 'placeholder:text-slate-300 text-slate-700'}`}
          placeholder="Inicie o registo Orenstein..."
        />
      </div>
    </div>
  );
}