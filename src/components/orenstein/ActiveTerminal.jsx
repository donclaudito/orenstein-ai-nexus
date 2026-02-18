import React from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';

export default function ActiveTerminal({ workspaceName, isDarkMode }) {
  return (
    <div className={`${isDarkMode ? 'bg-slate-950/80 text-emerald-500 border-slate-800' : 'bg-slate-900 text-emerald-400 border-slate-700'} backdrop-blur-xl p-8 rounded-[2rem] font-mono text-xs h-72 overflow-y-auto border shadow-2xl relative group`}>
      <div className="absolute top-4 right-6 flex gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/40"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40"></div>
      </div>
      <div className="flex items-center gap-3 mb-6 border-b border-slate-800/50 pb-3 text-slate-500">
        <TerminalIcon className="w-4 h-4" />
        <span className="tracking-widest uppercase text-[10px]">orenstein_base44_v1.8.0</span>
      </div>
      <div className="space-y-2">
        <p><span className="text-blue-500 font-bold">sys_core:</span>{">"} Inicializando Kernel Adaptativo Base44...</p>
        <p className="text-blue-400"><span className="text-blue-500 font-bold">sys_core:</span>{">"} Resolvida falha de referências 'sectors'.</p>
        <p className="text-blue-400"><span className="text-blue-500 font-bold">sys_core:</span>{">"} Protocolo de Materialização de Ativos: ONLINE.</p>
        <p className="text-slate-400"><span className="text-blue-500 font-bold">sys_core:</span>{">"} Workspace "{workspaceName}" integrado com sucesso.</p>
        <p className="text-emerald-400 font-bold animate-pulse mt-4">INFRAESTRUTURA NOMINAL_</p>
        <div className="flex gap-1 mt-4"><span className="text-emerald-500 font-bold">admin@base44:~$</span><div className="w-2 h-4 bg-emerald-500 animate-pulse"></div></div>
      </div>
    </div>
  );
}