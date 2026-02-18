import React, { useState } from 'react';
import { Sparkles, Archive, PackageOpen } from 'lucide-react';
import { SECTORS_LIST, getSectorStyles, getSectorIcon } from './sectorStyles';
import AppCard from './AppCard';

export default function AppsPanel({ isDarkMode, activeCategory, setActiveCategory, filteredApps, archivedApps, onSelectApp, onEditApp, onDeleteApp, onArchiveApp }) {
  const [showArchived, setShowArchived] = useState(false);
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex gap-3">
          <button
            onClick={() => setShowArchived(false)}
            className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${!showArchived ? 'bg-blue-600 text-white shadow-xl' : (isDarkMode ? 'bg-slate-900/40 text-slate-500' : 'bg-white text-slate-500')}`}
          >
            <PackageOpen className="w-4 h-4 inline mr-2" />
            Ativos
          </button>
          <button
            onClick={() => setShowArchived(true)}
            className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${showArchived ? 'bg-amber-600 text-white shadow-xl' : (isDarkMode ? 'bg-slate-900/40 text-slate-500' : 'bg-white text-slate-500')}`}
          >
            <Archive className="w-4 h-4 inline mr-2" />
            Arquivados ({archivedApps?.length || 0})
          </button>
        </div>
      </div>

      {!showArchived && (
        <>
      <div className="flex flex-wrap gap-3 mb-16">
        {["Todos", "Administrativo", "Médico", "Orientações"].map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${activeCategory === cat ? 'bg-blue-600 border-blue-400 text-white shadow-xl shadow-blue-500/40' : isDarkMode ? 'bg-slate-900/40 border-slate-800 text-slate-500 hover:text-slate-300' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-800'}`}>{cat}</button>
        ))}
      </div>

      <div className="space-y-24">
        {SECTORS_LIST.map(sector => {
          const appsInSector = filteredApps.filter(app => app.category === sector);
          if (activeCategory !== "Todos" && activeCategory !== sector) return null;
          if (appsInSector.length === 0) return null;
          const sectorStyle = getSectorStyles(sector, isDarkMode);
          return (
            <div key={sector}>
              <div className="flex items-center gap-6 mb-10">
                <div className={`p-3 rounded-2xl border shadow-lg ${sectorStyle.border} ${sectorStyle.bg}`}>{getSectorIcon(sector)}</div>
                <h3 className={`text-2xl font-black uppercase italic tracking-widest ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{sector}</h3>
                <div className={`flex-1 h-px ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-200'}`} />
                <div className={`flex items-center gap-3 px-5 py-2 rounded-full border shadow-inner ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-slate-100'}`}>
                  <Sparkles className="w-3 h-3 text-blue-500" />
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{appsInSector.length} Ativo{appsInSector.length === 1 ? '' : 's'}</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {appsInSector.map(app => <AppCard key={app.id} app={app} isDarkMode={isDarkMode} onSelect={onSelectApp} onEdit={onEditApp} onDelete={onDeleteApp} onArchive={onArchiveApp} />)}
              </div>
            </div>
          );
        })}
      </div>
        </>
      )}

      {showArchived && (
        <div className="space-y-8">
          <h3 className={`text-2xl font-black uppercase italic ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Aplicativos Arquivados
          </h3>
          {!archivedApps || archivedApps.length === 0 ? (
            <div className={`text-center py-20 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              <Archive className="w-20 h-20 mx-auto mb-6 opacity-20" />
              <p className="font-bold text-lg">Nenhum aplicativo arquivado</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {archivedApps.map(app => (
                <div key={app.id} className="relative">
                  <AppCard
                    app={app}
                    isDarkMode={isDarkMode}
                    onSelect={onSelectApp}
                    onEdit={onEditApp}
                    onDelete={onDeleteApp}
                  />
                  <button
                    onClick={(e) => { e.stopPropagation(); onArchiveApp(app.id, false); }}
                    className={`absolute top-8 right-8 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all z-10 ${isDarkMode ? 'bg-green-600 text-white hover:bg-green-500 shadow-xl' : 'bg-green-600 text-white hover:bg-green-700 shadow-xl'}`}
                  >
                    Restaurar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}