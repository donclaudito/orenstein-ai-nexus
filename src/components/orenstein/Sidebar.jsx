import React from 'react';
import {
  Layers, LayoutGrid, PackagePlus, FileText,
  Terminal as TerminalIcon, User, LogOut, Folder,
  ChevronDown, ChevronUp, Box
} from 'lucide-react';
import { SECTORS_LIST } from './sectorStyles';
import { ICON_MAP } from './iconMap';

export default function Sidebar({
  isDarkMode,
  activeTab,
  setActiveTab,
  activeApp,
  setActiveApp,
  currentWorkspace,
  activeWsId,
  setActiveWsId,
  workspaces,
  apps,
  collapsedSectors,
  toggleSectorCollapse,
  triggerNewApp
}) {
  return (
    <aside className={`w-80 backdrop-blur-2xl border-r flex flex-col z-30 ${isDarkMode ? 'bg-slate-950/40 border-slate-800/50' : 'bg-white border-slate-200'}`}>
      <div className="p-8 mb-4">
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => { setActiveTab("Aplicações"); setActiveApp(null); }}>
          <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black italic shadow-lg group-hover:scale-105 transition-all duration-500 text-xl">O</div>
          <div>
            <h1 className={`text-xl font-black tracking-tighter uppercase italic leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Orenstein</h1>
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Neural Hub</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-10 custom-scrollbar">
        {/* Contexto Operacional */}
        <section>
          <p className={`px-4 text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Contexto Operacional</p>
          <div className="space-y-2">
            {workspaces.map(ws => (
              <button
                key={ws.id}
                onClick={() => { setActiveWsId(ws.id); setActiveTab("Aplicações"); setActiveApp(null); }}
                className={`w-full flex items-center gap-4 px-5 py-5 rounded-[2.5rem] border transition-all ${ws.id === activeWsId ? (isDarkMode ? 'bg-blue-600 border-blue-400 shadow-xl text-white' : 'bg-blue-50 border-blue-200 text-blue-800 shadow-sm') : (isDarkMode ? 'bg-slate-900/40 border-slate-800/50 text-slate-400 hover:bg-slate-900/60' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm')}`}
              >
                <div className={`p-2 rounded-xl ${ws.id === activeWsId ? (isDarkMode ? 'bg-white/20' : 'bg-white shadow-sm') : (isDarkMode ? 'bg-slate-800/50' : 'bg-slate-100')}`}>
                  {ICON_MAP[ws.icon_key] || <Box className="w-5 h-5" />}
                </div>
                <span className="text-xs font-black uppercase tracking-wide truncate flex-1 text-left">{ws.name}</span>
              </button>
            ))}
          </div>
          <div className="space-y-4 mt-4">

            <div className="pl-4 space-y-2 mt-6">
              {SECTORS_LIST.map(sector => {
                const sectorApps = apps.filter(app => app.workspace_id === activeWsId && app.category === sector);
                if (sectorApps.length === 0) return null;
                const isCollapsed = collapsedSectors[sector];
                return (
                  <div key={sector} className="space-y-1">
                    <button onClick={() => toggleSectorCollapse(sector)} className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${isDarkMode ? 'text-slate-500 hover:text-slate-300 hover:bg-white/5' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'}`}>
                      <div className="flex items-center gap-2"><Folder className={`w-3 h-3 transition-transform ${!isCollapsed ? 'rotate-12' : ''}`} />{sector}</div>
                      {isCollapsed ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
                    </button>
                    {!isCollapsed && (
                      <div className="space-y-1">
                        {sectorApps.map(app => (
                          <button key={app.id} onClick={() => { setActiveApp(app); setActiveTab("Aplicações"); }} className={`w-full flex items-center gap-3 px-4 py-2 rounded-2xl text-[10px] font-bold uppercase transition-all ${activeApp?.id === app.id ? (isDarkMode ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-sm' : 'bg-blue-50 text-blue-600 border border-blue-100 shadow-sm') : (isDarkMode ? 'text-slate-500 hover:text-slate-300 hover:bg-white/5' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100')}`}>
                            <span className="truncate">{app.title}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <div className={`h-px mx-4 ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-100'}`} />

        {/* Infraestrutura */}
        <section>
          <p className={`px-4 text-[10px] font-black uppercase tracking-[0.3em] mb-6 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Infraestrutura</p>
          <div className="space-y-4 px-2">
            <div className={`p-4 rounded-[2.5rem] border transition-all duration-500 ${isDarkMode ? 'bg-slate-900/40 border-slate-800/50' : 'bg-slate-50 border-slate-200'}`}>
              <div className="space-y-2">
                <button onClick={() => { setActiveTab("Aplicações"); setActiveApp(null); }} className={`w-full flex items-center gap-4 px-5 py-4 rounded-3xl transition-all duration-300 border ${activeTab === 'Aplicações' && !activeApp ? (isDarkMode ? 'bg-blue-600 border-blue-400 shadow-lg text-white' : 'bg-white border-blue-200 text-blue-800 shadow-sm') : 'border-transparent text-slate-500 hover:text-blue-500'}`}>
                  <Layers className="w-5 h-5" />
                  <span className="text-xs font-black uppercase tracking-tight truncate flex-1 text-left">Painel Central</span>
                </button>
                <button onClick={() => { setActiveTab("Definições"); setActiveApp(null); }} className={`w-full flex items-center gap-4 px-5 py-4 rounded-3xl transition-all duration-300 border ${activeTab === 'Definições' ? (isDarkMode ? 'bg-blue-600 border-blue-400 shadow-lg text-white' : 'bg-white border-blue-200 text-blue-800 shadow-sm') : 'border-transparent text-slate-500 hover:text-blue-500'}`}>
                  <LayoutGrid className="w-5 h-5" />
                  <span className="text-xs font-black uppercase tracking-tight truncate flex-1 text-left">Gestão Workspaces</span>
                </button>
              </div>
            </div>

            <button onClick={triggerNewApp} className="w-full flex items-center justify-center gap-4 py-5 rounded-[2.5rem] text-xs font-black uppercase bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl hover:scale-105 active:scale-95 transition-all">
              <PackagePlus className="w-5 h-5" /> Materializar Ativo
            </button>
          </div>
        </section>

        <div className={`h-px mx-4 ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-100'}`} />

        {/* Operacional */}
        <section>
          <p className={`px-4 text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Operacional</p>
          <div className="space-y-1.5">
            <button onClick={() => { setActiveTab("Notas"); setActiveApp(null); }} className={`w-full flex items-center gap-4 px-5 py-3 rounded-2xl text-xs font-bold transition-all border ${activeTab === 'Notas' ? 'bg-amber-500/10 border-amber-500/20 text-amber-600 shadow-sm' : 'text-slate-500 border-transparent hover:bg-black/5'}`}>
              <FileText className="w-4 h-4" /> Notas de Kernel
            </button>
            <button onClick={() => { setActiveTab("Terminal"); setActiveApp(null); }} className={`w-full flex items-center gap-4 px-5 py-3 rounded-2xl text-xs font-bold transition-all border ${activeTab === 'Terminal' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 shadow-sm' : 'text-slate-500 border-transparent hover:bg-black/5'}`}>
              <TerminalIcon className="w-4 h-4" /> Terminal Ativo
            </button>
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className={`p-6 border-t ${isDarkMode ? 'border-slate-800/50 bg-slate-900/20' : 'border-slate-100 bg-slate-50'}`}>
        <div className={`flex items-center gap-4 p-4 rounded-3xl border shadow-sm ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white shadow-md"><User className="w-6 h-6" /></div>
          <div className="flex-1 overflow-hidden">
            <p className={`text-[11px] font-black truncate uppercase italic leading-none mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Admin Orenstein</p>
            <button className="text-[9px] text-red-500 font-bold uppercase tracking-widest hover:text-red-400 flex items-center gap-1 transition-colors"><LogOut className="w-3 h-3" /> Terminar</button>
          </div>
        </div>
      </div>
    </aside>
  );
}