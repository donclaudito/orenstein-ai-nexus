import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function DescriptionPopover({ title, content, isDarkMode, onClose }) {
  // Fechar com ESC
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8 popover-fade-in"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 backdrop-blur-md bg-black/60" />

      {/* Janela */}
      <div
        className={`relative z-10 w-full max-w-2xl max-h-[80vh] flex flex-col rounded-[2.5rem] shadow-2xl border overflow-hidden popover-slide-up ${
          isDarkMode
            ? 'bg-slate-900 border-slate-700/60 text-slate-200'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-start justify-between gap-4 px-8 pt-8 pb-6 border-b flex-shrink-0 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
          <div>
            <p className={`text-[10px] font-black uppercase tracking-[0.25em] mb-1 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`}>
              Descrição Completa
            </p>
            <h3 className={`text-xl sm:text-2xl font-black uppercase italic tracking-tight leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`flex-shrink-0 p-2.5 rounded-2xl transition-all mt-1 ${
              isDarkMode
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo com scroll */}
        <div className="flex-1 overflow-y-auto px-8 py-7 custom-scrollbar">
          <div
            className={`prose prose-sm max-w-none leading-relaxed text-[15px] sm:text-[16px] ${
              isDarkMode
                ? 'prose-invert prose-p:text-slate-300 prose-li:text-slate-300 prose-strong:text-white prose-headings:text-white'
                : 'prose-p:text-slate-600 prose-li:text-slate-600 prose-strong:text-slate-900'
            }`}
            dangerouslySetInnerHTML={{ __html: content || '<p>Sem descrição disponível.</p>' }}
          />
        </div>

        {/* Footer */}
        <div className={`px-8 py-5 border-t flex-shrink-0 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
          <button
            onClick={onClose}
            className={`w-full py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
              isDarkMode
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-500'
            }`}
          >
            Fechar
          </button>
        </div>
      </div>

      <style>{`
        @keyframes popoverFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popoverSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .popover-fade-in { animation: popoverFadeIn 0.2s ease-out forwards; }
        .popover-slide-up { animation: popoverSlideUp 0.25s ease-out forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(120,120,120,0.15); border-radius: 10px; }
      `}</style>
    </div>
  );
}