import React, { useEffect } from 'react';
import { Zap, RotateCw } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function AppViewer({ app, isDarkMode, onRefresh }) {
  useEffect(() => {
    if (app?.id) {
      base44.entities.AppAccessLog.create({
        app_id: app.id,
        app_title: app.title,
        app_category: app.category || '',
        workspace_id: app.workspace_id || '',
      }).catch(() => {});
    }
  }, [app?.id]);
  return (
    <div className={`w-full h-full flex flex-col rounded-[3rem] overflow-hidden border shadow-3xl ${isDarkMode ? 'border-slate-800 bg-black shadow-black/50' : 'border-slate-200 bg-white shadow-slate-200'}`}>
      <div className={`h-14 backdrop-blur-xl border-b flex items-center justify-between px-8 shrink-0 ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
        <div className="flex items-center gap-4">
          <Zap className="w-4 h-4 text-blue-500 animate-pulse" />
          <span className={`text-[11px] font-black uppercase italic tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Ativo: <span className={isDarkMode ? 'text-white' : 'text-slate-900'}>{app.title}</span></span>
        </div>
        <button onClick={onRefresh} className={`p-2 transition-all ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}><RotateCw className="w-4 h-4" /></button>
      </div>
      <iframe src={app.url} className="flex-1 w-full border-none" title={app.title} />
    </div>
  );
}