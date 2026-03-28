import React, { memo, useState } from 'react';
import { Pencil, Trash2, ChevronRight, Archive } from 'lucide-react';
import { getSectorStyles } from './sectorStyles';
import DescriptionPopover from './DescriptionPopover';

const AppCard = memo(({ app, isDarkMode, onSelect, onEdit, onDelete, onArchive }) => {
  const style = getSectorStyles(app.category, isDarkMode);
  const [showPopover, setShowPopover] = useState(false);

  const summaryText = app.card_summary || app.description?.replace(/<[^>]*>/g, '') || '';
  const hasDetails = !!(app.description && app.description.replace(/<[^>]*>/g, '').trim());

  return (
    <>
      <div
        onClick={() => onSelect(app)}
        className={`group relative ${isDarkMode ? 'bg-white/5 border-slate-200/10 shadow-2xl' : 'bg-white border-slate-200 shadow-xl'} backdrop-blur-md rounded-[2.5rem] p-8 border hover:border-blue-500/50 transition-all duration-500 cursor-pointer hover:-translate-y-2 overflow-hidden text-left`}
      >
        {/* Hover action buttons */}
        <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
          <button onClick={(e) => { e.stopPropagation(); onEdit(app); }} className="p-2.5 bg-blue-500/20 hover:bg-blue-500 text-blue-500 hover:text-white rounded-xl transition-all"><Pencil className="w-4 h-4" /></button>
          {onArchive && <button onClick={(e) => { e.stopPropagation(); onArchive(app.id, true); }} className="p-2.5 bg-amber-500/20 hover:bg-amber-500 text-amber-500 hover:text-white rounded-xl transition-all"><Archive className="w-4 h-4" /></button>}
          <button onClick={(e) => { e.stopPropagation(); onDelete(app.id); }} className="p-2.5 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
        </div>

        {/* Icon */}
        <div className={`w-14 h-14 ${style.bg} rounded-2xl flex items-center justify-center mb-8 border ${style.border} group-hover:scale-110 transition-transform duration-500`}>
          {style.icon}
        </div>

        {/* Title */}
        <h3 className={`text-xl font-black mb-3 tracking-tight group-hover:text-blue-500 transition-colors ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
          {app.title}
        </h3>

        {/* Summary — clicável para abrir popover */}
        {hasDetails ? (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setShowPopover(true); }}
            className={`text-sm font-medium leading-relaxed mb-8 line-clamp-2 text-left w-full transition-colors ${
              isDarkMode
                ? 'text-slate-400 hover:text-blue-400'
                : 'text-slate-500 hover:text-blue-600'
            } underline-offset-2 hover:underline cursor-pointer`}
            title="Clique para ver a descrição completa"
          >
            {summaryText}
          </button>
        ) : (
          <p className={`text-sm font-medium leading-relaxed mb-8 line-clamp-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {summaryText}
          </p>
        )}

        {/* Footer */}
        <div className={`flex items-center justify-between pt-6 border-t ${isDarkMode ? 'border-slate-800/50' : 'border-slate-100'}`}>
          <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${style.text}`}>{app.category}</span>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 group-hover:text-blue-500 uppercase transition-all">
            Ativar <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Popover com descrição detalhada */}
      {showPopover && (
        <DescriptionPopover
          title={app.title}
          content={app.description}
          isDarkMode={isDarkMode}
          onClose={() => setShowPopover(false)}
        />
      )}
    </>
  );
});

export default AppCard;