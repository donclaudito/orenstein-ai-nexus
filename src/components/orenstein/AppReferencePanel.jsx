/**
 * AppReferencePanel — Módulo de Consulta de Funções
 *
 * Exibe uma visão consolidada de todos os aplicativos registrados no sistema,
 * incluindo metadados completos: URL, categoria, workspace, tags, resumo e descrição.
 *
 * Destinado a desenvolvedores que precisam de uma referência rápida e filtrável
 * de todos os ativos da plataforma.
 */

import React, { useState, useMemo } from 'react';
import {
  Search, X, ExternalLink, Tag, ChevronDown, ChevronRight,
  Layers, Globe, BookOpen, Filter, Copy, Check
} from 'lucide-react';
import { WORKSPACE_COLORS } from './workspaceColors';

// ─── Utilitários ────────────────────────────────────────────────────────────

/** Remove tags HTML da descrição para exibição em texto puro */
function stripHtml(html = '') {
  return html.replace(/<[^>]*>/g, '').trim();
}

/** Copia texto para a área de transferência com feedback visual */
function useCopyToClipboard() {
  const [copiedId, setCopiedId] = useState(null);
  const copy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };
  return { copiedId, copy };
}

// ─── Subcomponente: AppReferenceRow ─────────────────────────────────────────

/**
 * Linha expandível de cada aplicativo na tabela de consulta.
 * Mostra metadados resumidos e expande para exibir a descrição completa.
 */
function AppReferenceRow({ app, workspace, isDarkMode, onTagClick, copiedId, onCopy }) {
  const [expanded, setExpanded] = useState(false);
  const wsColor = WORKSPACE_COLORS[workspace?.color || 'blue'];
  const descText = stripHtml(app.description);
  const hasDescription = !!descText;

  const row = `border-b transition-colors ${
    isDarkMode
      ? 'border-slate-800/60 hover:bg-slate-800/30'
      : 'border-slate-100 hover:bg-slate-50'
  }`;

  return (
    <>
      <tr className={row}>
        {/* Expand toggle + título */}
        <td className="px-4 py-4 min-w-[180px]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setExpanded(e => !e)}
              disabled={!hasDescription}
              className={`p-1 rounded-lg transition-all flex-shrink-0 ${
                hasDescription
                  ? isDarkMode
                    ? 'text-slate-400 hover:text-blue-400 hover:bg-slate-700'
                    : 'text-slate-400 hover:text-blue-600 hover:bg-slate-100'
                  : 'opacity-0 pointer-events-none'
              }`}
              title="Ver descrição completa"
            >
              {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
            <span className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {app.title}
            </span>
          </div>
        </td>

        {/* URL com botão de cópia */}
        <td className="px-4 py-4 min-w-[200px] max-w-[220px]">
          <div className="flex items-center gap-2">
            <a
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-xs font-medium truncate flex-1 transition-colors ${
                isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
              }`}
              title={app.url}
            >
              {app.url}
            </a>
            <div className="flex gap-1 flex-shrink-0">
              {/* Cópia da URL */}
              <button
                onClick={() => onCopy(app.url, `url-${app.id}`)}
                className={`p-1 rounded-lg transition-all ${
                  isDarkMode
                    ? 'text-slate-500 hover:text-blue-400 hover:bg-slate-700'
                    : 'text-slate-400 hover:text-blue-600 hover:bg-slate-100'
                }`}
                title="Copiar URL"
              >
                {copiedId === `url-${app.id}`
                  ? <Check className="w-3 h-3 text-emerald-400" />
                  : <Copy className="w-3 h-3" />}
              </button>
              {/* Abrir em nova aba */}
              <a
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-1 rounded-lg transition-all ${
                  isDarkMode
                    ? 'text-slate-500 hover:text-blue-400 hover:bg-slate-700'
                    : 'text-slate-400 hover:text-blue-600 hover:bg-slate-100'
                }`}
                title="Abrir em nova aba"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </td>

        {/* Categoria */}
        <td className="px-4 py-4">
          <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${
            isDarkMode
              ? 'bg-slate-800 border-slate-700 text-slate-300'
              : 'bg-slate-100 border-slate-200 text-slate-600'
          }`}>
            {app.category || '—'}
          </span>
        </td>

        {/* Workspace */}
        <td className="px-4 py-4">
          {workspace ? (
            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${wsColor.border} ${
              isDarkMode ? 'bg-slate-900' : 'bg-white'
            } ${wsColor.text}`}>
              {workspace.name}
            </span>
          ) : (
            <span className="text-xs text-slate-400">—</span>
          )}
        </td>

        {/* Tags */}
        <td className="px-4 py-4 max-w-[200px]">
          <div className="flex flex-wrap gap-1">
            {(app.tags || []).length === 0 ? (
              <span className={`text-xs ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`}>—</span>
            ) : (
              (app.tags || []).map(tag => (
                <button
                  key={tag}
                  onClick={() => onTagClick(tag)}
                  className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full border transition-all cursor-pointer ${
                    isDarkMode
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                  }`}
                  title={`Filtrar por #${tag}`}
                >
                  #{tag}
                </button>
              ))
            )}
          </div>
        </td>

        {/* Resumo */}
        <td className="px-4 py-4 max-w-[220px]">
          <span className={`text-xs font-medium line-clamp-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {app.card_summary || '—'}
          </span>
        </td>
      </tr>

      {/* Linha expandida: descrição completa */}
      {expanded && hasDescription && (
        <tr className={`${isDarkMode ? 'bg-slate-900/60' : 'bg-slate-50'}`}>
          <td colSpan={6} className="px-10 py-5">
            <div className={`rounded-2xl p-5 border text-sm leading-relaxed font-medium ${
              isDarkMode
                ? 'bg-black/30 border-slate-800 text-slate-300'
                : 'bg-white border-slate-200 text-slate-600'
            }`}>
              <p className={`text-[9px] font-black uppercase tracking-[0.3em] mb-3 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                Descrição Completa
              </p>
              {/* Renderiza HTML se presente, texto puro caso contrário */}
              {app.description?.includes('<') ? (
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: app.description }}
                />
              ) : (
                <p>{descText}</p>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ─── Componente Principal ────────────────────────────────────────────────────

export default function AppReferencePanel({ isDarkMode, apps, workspaces }) {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterWorkspace, setFilterWorkspace] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const { copiedId, copy } = useCopyToClipboard();

  // Workspace indexado por ID para lookup O(1)
  const workspaceMap = useMemo(() =>
    Object.fromEntries(workspaces.map(ws => [ws.id, ws])),
    [workspaces]
  );

  // Extrai todas as categorias e tags únicas dos apps para os filtros
  const allCategories = useMemo(() => {
    const set = new Set(apps.map(a => a.category).filter(Boolean));
    return Array.from(set).sort();
  }, [apps]);

  const allTags = useMemo(() => {
    const set = new Set();
    apps.forEach(a => (a.tags || []).forEach(t => set.add(t)));
    return Array.from(set).sort();
  }, [apps]);

  // Aplica todos os filtros combinados
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return apps.filter(app => {
      // Filtro por status de arquivamento
      if (!showArchived && app.is_archived) return false;
      if (showArchived && !app.is_archived) return false;
      // Filtros por categoria, workspace e tag
      if (filterCategory && app.category !== filterCategory) return false;
      if (filterWorkspace && app.workspace_id !== filterWorkspace) return false;
      if (filterTag && !(app.tags || []).includes(filterTag)) return false;
      // Busca textual
      if (q) {
        const text = [
          app.title,
          app.card_summary,
          stripHtml(app.description),
          app.category,
          app.url,
          ...(app.tags || []),
        ].join(' ').toLowerCase();
        return text.includes(q);
      }
      return true;
    });
  }, [apps, search, filterCategory, filterWorkspace, filterTag, showArchived]);

  const hasFilters = search || filterCategory || filterWorkspace || filterTag;

  const clearFilters = () => {
    setSearch('');
    setFilterCategory('');
    setFilterWorkspace('');
    setFilterTag('');
  };

  // Estilos reutilizáveis
  const selectCls = `text-xs font-bold px-4 py-2.5 rounded-2xl border outline-none transition-all cursor-pointer ${
    isDarkMode
      ? 'bg-slate-900 border-slate-800 text-slate-300 focus:border-blue-500/50'
      : 'bg-white border-slate-200 text-slate-700 focus:border-blue-400'
  }`;

  const thCls = `px-4 py-3.5 text-[9px] font-black uppercase tracking-[0.3em] text-left whitespace-nowrap ${
    isDarkMode ? 'text-slate-500 border-b border-slate-800' : 'text-slate-400 border-b border-slate-200'
  }`;

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* ── Cabeçalho ── */}
      <div className="flex items-center gap-4 mb-2">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h2 className={`text-2xl font-black uppercase italic tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Consulta de Funções
          </h2>
          <p className={`text-xs font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            Referência técnica completa de todos os aplicativos registrados
          </p>
        </div>
        {/* Contador total */}
        <div className={`ml-auto flex items-center gap-2 px-4 py-2 rounded-full border flex-shrink-0 ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
          <Layers className="w-3 h-3 text-indigo-500" />
          <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {filtered.length} / {apps.filter(a => !a.is_archived).length} apps
          </span>
        </div>
      </div>

      {/* ── Barra de filtros ── */}
      <div className={`p-4 rounded-[1.5rem] border space-y-3 ${isDarkMode ? 'bg-slate-900/30 border-slate-800/50' : 'bg-white border-slate-200'}`}>
        <div className="flex flex-wrap gap-3 items-center">

          {/* Busca textual */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
            <input
              type="text"
              placeholder="Buscar por nome, URL, categoria, tag..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={`w-full pl-11 pr-10 py-3 rounded-2xl text-sm font-bold border outline-none transition-all ${
                isDarkMode
                  ? 'bg-black/40 border-slate-800 text-white placeholder:text-slate-600 focus:border-indigo-500/50'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-400'
              }`}
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className={`w-4 h-4 ${isDarkMode ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-700'}`} />
              </button>
            )}
          </div>

          {/* Filtro por Categoria */}
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className={selectCls}
          >
            <option value="">Todas as categorias</option>
            {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Filtro por Workspace */}
          <select
            value={filterWorkspace}
            onChange={e => setFilterWorkspace(e.target.value)}
            className={selectCls}
          >
            <option value="">Todos os workspaces</option>
            {workspaces.map(ws => <option key={ws.id} value={ws.id}>{ws.name}</option>)}
          </select>

          {/* Filtro por Tag */}
          {allTags.length > 0 && (
            <select
              value={filterTag}
              onChange={e => setFilterTag(e.target.value)}
              className={selectCls}
            >
              <option value="">Todas as tags</option>
              {allTags.map(t => <option key={t} value={t}>#{t}</option>)}
            </select>
          )}

          {/* Toggle arquivados */}
          <button
            onClick={() => setShowArchived(v => !v)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-black uppercase tracking-widest transition-all ${
              showArchived
                ? isDarkMode
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  : 'bg-amber-50 border-amber-200 text-amber-700'
                : isDarkMode
                  ? 'border-slate-800 text-slate-500 hover:text-slate-300'
                  : 'border-slate-200 text-slate-500 hover:text-slate-700'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            {showArchived ? 'Arquivados' : 'Ativos'}
          </button>

          {/* Limpar filtros */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest text-blue-500 hover:text-blue-400 transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Limpar
            </button>
          )}
        </div>

        {/* Tags ativas como pills */}
        {filterTag && (
          <div className="flex items-center gap-2 pt-1">
            <Tag className={`w-3 h-3 ${isDarkMode ? 'text-emerald-500' : 'text-emerald-600'}`} />
            <button
              onClick={() => setFilterTag('')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border transition-all ${
                isDarkMode
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-700'
              }`}
            >
              #{filterTag} <X className="w-2.5 h-2.5" />
            </button>
          </div>
        )}
      </div>

      {/* ── Tabela de referência ── */}
      <div className={`rounded-[2rem] border overflow-hidden ${isDarkMode ? 'border-slate-800/60 bg-slate-900/20' : 'border-slate-200 bg-white'}`}>
        {filtered.length === 0 ? (
          // Estado vazio
          <div className={`flex flex-col items-center py-20 gap-3 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
            <Globe className="w-10 h-10 opacity-30" />
            <p className="text-xs font-black uppercase tracking-widest opacity-60">
              {hasFilters ? 'Nenhum resultado para os filtros aplicados' : 'Nenhum aplicativo registrado'}
            </p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="mt-2 px-5 py-2.5 rounded-full bg-indigo-600 text-white text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all"
              >
                Limpar filtros
              </button>
            )}
          </div>
        ) : (
          // Tabela responsiva com scroll horizontal
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse">
              <thead className={isDarkMode ? 'bg-slate-900/60' : 'bg-slate-50'}>
                <tr>
                  <th className={thCls}>Aplicativo</th>
                  <th className={thCls}>URL</th>
                  <th className={thCls}>Categoria</th>
                  <th className={thCls}>Workspace</th>
                  <th className={thCls}>Tags</th>
                  <th className={thCls}>Resumo</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(app => (
                  <AppReferenceRow
                    key={app.id}
                    app={app}
                    workspace={workspaceMap[app.workspace_id]}
                    isDarkMode={isDarkMode}
                    onTagClick={(tag) => setFilterTag(tag)}
                    copiedId={copiedId}
                    onCopy={copy}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}