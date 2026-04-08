import React from 'react';
import { ChevronRight, Pencil, Trash2, Archive, Star } from 'lucide-react';
import { getSectorStyles } from './sectorStyles';

export default function AppListItem({ app, isDarkMode, onSelect, onEdit, onDelete, onArchive, isFavorite, onToggleFavorite, onTagClick }) {
  const style = getSectorStyles(app.category, isDarkMode);

  return (
    <div
      onClick={() => onSelect(app)}
      className={`group grid grid-cols-[auto_1fr_auto] gap-4 px-6 py-4 cursor-pointer transition-all items-center border-b last:border-b-0 ${
        isDarkMode
          ? 'border-slate-800/50 hover:bg-white/5'
          : 'border-slate-100 hover:bg-blue-50/40'
      }`}
    >
      {/* Icon */}
      <div className={`w-10 h-10 ${style.bg} rounded-xl flex items-center justify-center border ${style.border} flex-shrink-0`}>
        {style.icon}
      </div>

      {/* Info */}
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-sm font-black truncate group-hover:text-blue-500 transition-colors ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
            {app.title}
          </span>
          <span className={`text-[10px] font-black uppercase tracking-widest ${style.text}`}>
            {app.category}
          </span>
          {(app.tags || []).slice(0, 4).map(tag => (
            <button
              key={tag}
              onClick={(e) => { e.stopPropagation(); onTagClick?.(tag); }}
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                isDarkMode
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              #{tag}
            </button>
          ))}
          {(app.tags || []).length > 4 && (
            <span className={`text-[10px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              +{app.tags.length - 4}
            </span>
          )}
        </div>
        {app.card_summary && (
          <p className={`text-xs mt-0.5 truncate ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            {app.card_summary}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {onToggleFavorite && (
          <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(app.id); }} className="p-2 rounded-xl hover:bg-amber-500/10 transition-all">
            <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-400 hover:text-amber-400'}`} />
          </button>
        )}
        <button onClick={(e) => { e.stopPropagation(); onEdit(app); }} className="p-2 bg-blue-500/10 hover:bg-blue-500 text-blue-500 hover:text-white rounded-xl transition-all">
          <Pencil className="w-3.5 h-3.5" />
        </button>
        {onArchive && (
          <button onClick={(e) => { e.stopPropagation(); onArchive(app.id, true); }} className="p-2 bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-white rounded-xl transition-all">
            <Archive className="w-3.5 h-3.5" />
          </button>
        )}
        <button onClick={(e) => { e.stopPropagation(); onDelete(app.id); }} className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all ml-1" />
      </div>
    </div>
  );
}