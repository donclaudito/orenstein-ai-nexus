import React from 'react';
import { Sparkles } from 'lucide-react';
import { ICON_MAP } from './iconMap';
import { WORKSPACE_COLORS } from './workspaceColors';
import AppCard from './AppCard';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

export default function AppsPanel({ isDarkMode, activeCategory, setActiveCategory, filteredApps, archivedApps, onSelectApp, onEditApp, onDeleteApp, onArchiveApp }) {
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => base44.entities.Category.list('order_index'),
    initialData: [],
  });
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-8 sm:mb-16">
        <button onClick={() => setActiveCategory("Todos")} className={`px-4 sm:px-8 py-2 sm:py-3 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${activeCategory === "Todos" ? 'bg-blue-600 border-blue-400 text-white shadow-xl shadow-blue-500/40' : isDarkMode ? 'bg-slate-900/40 border-slate-800 text-slate-500 hover:text-slate-300' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-800'}`}>Todos</button>
        {categories.map(cat => (
          <button key={cat.id} onClick={() => setActiveCategory(cat.name)} className={`px-4 sm:px-8 py-2 sm:py-3 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${activeCategory === cat.name ? 'bg-blue-600 border-blue-400 text-white shadow-xl shadow-blue-500/40' : isDarkMode ? 'bg-slate-900/40 border-slate-800 text-slate-500 hover:text-slate-300' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-800'}`}>{cat.name}</button>
        ))}
      </div>

      <div className="space-y-12 sm:space-y-24">
        {categories.map(category => {
          const appsInCategory = filteredApps.filter(app => app.category === category.name);
          if (activeCategory !== "Todos" && activeCategory !== category.name) return null;
          if (appsInCategory.length === 0) return null;
          const categoryColor = WORKSPACE_COLORS[category.color || 'blue'];
          const CategoryIcon = ICON_MAP[category.icon_key] || ICON_MAP['Package'];
          return (
            <div key={category.id}>
              <div className="flex items-center gap-6 mb-10">
                <div className={`p-3 rounded-2xl border shadow-lg ${categoryColor.border} ${categoryColor.bg} text-white`}>
                  {CategoryIcon}
                </div>
                <h3 className={`text-2xl font-black uppercase italic tracking-widest ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{category.name}</h3>
                <div className={`flex-1 h-px ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-200'}`} />
                <div className={`flex items-center gap-3 px-5 py-2 rounded-full border shadow-inner ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-slate-100'}`}>
                  <Sparkles className="w-3 h-3 text-blue-500" />
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{appsInCategory.length} Ativo{appsInCategory.length === 1 ? '' : 's'}</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-8">
                {appsInCategory.map(app => <AppCard key={app.id} app={app} isDarkMode={isDarkMode} onSelect={onSelectApp} onEdit={onEditApp} onDelete={onDeleteApp} onArchive={onArchiveApp} />)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}