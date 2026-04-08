import React, { useState } from 'react';
import { Search, X, Star, LayoutGrid, Download, FileText, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';

function exportToCSV(apps) {
  const header = ['Título', 'Resumo', 'Categoria', 'Workspace', 'URL'];
  const rows = apps.map(a => [
    `"${(a.title || '').replace(/"/g, '""')}"`,
    `"${(a.card_summary || a.description?.replace(/<[^>]*>/g, '') || '').replace(/"/g, '""')}"`,
    `"${(a.category || '').replace(/"/g, '""')}"`,
    `"${(a.workspace_id || '').replace(/"/g, '""')}"`,
    `"${(a.url || '').replace(/"/g, '""')}"`,
  ]);
  const csv = '\uFEFF' + [header.join(';'), ...rows.map(r => r.join(';'))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `aplicacoes_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function exportToPDF(apps) {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.setTextColor(30, 64, 175);
  doc.text('Orenstein AI — Lista de Aplicações', 14, 18);
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}  |  Total: ${apps.length} apps`, 14, 26);

  let y = 36;
  apps.forEach((app, i) => {
    if (y > 270) { doc.addPage(); y = 20; }
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(`${i + 1}. ${app.title}`, 14, y);
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    const summary = (app.card_summary || app.description?.replace(/<[^>]*>/g, '') || '—').slice(0, 90);
    doc.text(`${app.category || '—'}  ·  ${summary}`, 20, y + 5);
    doc.setTextColor(59, 130, 246);
    doc.text(app.url || '', 20, y + 10);
    y += 18;
  });

  doc.save(`aplicacoes_${new Date().toISOString().slice(0, 10)}.pdf`);
}

export default function AppsPanelToolbar({
  isDarkMode,
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
  favoritesCount,
  filteredCount,
  totalCount,
  apps,
}) {
  const [exportLoading, setExportLoading] = useState(null);

  const handleExport = async (type) => {
    setExportLoading(type);
    await new Promise(r => setTimeout(r, 200));
    type === 'csv' ? exportToCSV(apps) : exportToPDF(apps);
    setExportLoading(null);
  };

  const inputBase = `w-full pl-9 pr-8 py-2.5 text-sm font-medium outline-none transition-all rounded-2xl border`;
  const inputStyle = isDarkMode
    ? `${inputBase} bg-slate-900/60 border-slate-800 text-white placeholder:text-slate-600 focus:border-blue-500/50`
    : `${inputBase} bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-400`;

  const btnBase = `flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border disabled:opacity-40 disabled:cursor-not-allowed`;

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-10 sm:mb-12 items-start sm:items-center">

      {/* Filtro de abas */}
      <div className={`flex p-1 rounded-2xl gap-1 border flex-shrink-0 ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
        <button
          onClick={() => setActiveFilter('all')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === 'all' ? (isDarkMode ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-900 text-white shadow-sm') : (isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-700')}`}
        >
          <LayoutGrid className="w-3.5 h-3.5" /> Todos
          <span className={`px-1.5 py-0.5 rounded-full text-[9px] ${activeFilter === 'all' ? 'bg-white/20' : (isDarkMode ? 'bg-slate-800' : 'bg-slate-100')}`}>{totalCount}</span>
        </button>
        <button
          onClick={() => setActiveFilter('favorites')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === 'favorites' ? 'bg-amber-500 text-white shadow-lg' : (isDarkMode ? 'text-slate-500 hover:text-amber-400' : 'text-slate-400 hover:text-amber-500')}`}
        >
          <Star className={`w-3.5 h-3.5 ${activeFilter === 'favorites' ? 'fill-current' : ''}`} /> Favoritos
          {favoritesCount > 0 && (
            <span className={`px-1.5 py-0.5 rounded-full text-[9px] ${activeFilter === 'favorites' ? 'bg-white/20' : 'bg-amber-500/20 text-amber-500'}`}>{favoritesCount}</span>
          )}
        </button>
      </div>

      {/* Search */}
      <div className="relative flex-1 min-w-0 w-full sm:w-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Buscar aplicações..."
          className={inputStyle}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Export */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => handleExport('csv')}
          disabled={!!exportLoading || apps.length === 0}
          className={`${btnBase} ${isDarkMode ? 'border-slate-800 bg-slate-900/60 text-slate-400 hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/30' : 'border-slate-200 bg-white text-slate-500 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200'}`}
          title="Exportar CSV"
        >
          {exportLoading === 'csv' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
          CSV
        </button>
        <button
          onClick={() => handleExport('pdf')}
          disabled={!!exportLoading || apps.length === 0}
          className={`${btnBase} ${isDarkMode ? 'border-slate-800 bg-slate-900/60 text-slate-400 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30' : 'border-slate-200 bg-white text-slate-500 hover:bg-red-50 hover:text-red-700 hover:border-red-200'}`}
          title="Exportar PDF"
        >
          {exportLoading === 'pdf' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
          PDF
        </button>
      </div>
    </div>
  );
}