import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Brain, Download, RefreshCw, ChevronDown, ChevronRight, ExternalLink, Tag, Layers, Sparkles, Copy, CheckCheck } from 'lucide-react';

/**
 * AppIntelligence
 * ---------------
 * Módulo de análise profunda de todos os aplicativos cadastrados.
 * Para cada app, utiliza InvokeLLM para extrair funcionalidades,
 * benefícios e casos de uso. O resultado pode ser exportado em JSON
 * para alimentar modelos de IA (ex: "Isa").
 */
export default function AppIntelligence({ isDarkMode, apps, workspaces }) {
  const [analysisMap, setAnalysisMap] = useState({}); // { [appId]: { features, benefits, useCases, status } }
  const [expanded, setExpanded] = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => base44.entities.Category.list('order_index'),
    initialData: [],
  });

  // Apenas apps não arquivados
  const activeApps = useMemo(() => apps.filter(a => !a.is_archived), [apps]);

  // Workspace name lookup
  const wsMap = useMemo(() => {
    const m = {};
    workspaces.forEach(w => { m[w.id] = w.name; });
    return m;
  }, [workspaces]);

  /**
   * Analisa um único app usando LLM.
   * Extrai: funcionalidades, benefícios, casos de uso e resumo técnico.
   */
  const analyzeApp = async (app) => {
    const rawDesc = app.description?.replace(/<[^>]*>/g, '').trim() || '';
    const context = [
      `Nome: ${app.title}`,
      `Categoria: ${app.category}`,
      `Workspace: ${wsMap[app.workspace_id] || 'N/A'}`,
      `Resumo: ${app.card_summary || ''}`,
      `Descrição: ${rawDesc}`,
      `URL: ${app.url}`,
      `Tags: ${(app.tags || []).join(', ') || 'nenhuma'}`,
    ].join('\n');

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Você é um analista de sistemas especialista em documentação técnica de ferramentas médicas e de produtividade.

Com base nos dados abaixo de um aplicativo, retorne um JSON estruturado com análise completa.

Dados do aplicativo:
${context}

Retorne JSON com exatamente estas chaves:
- "features": array de strings (máx. 6 itens) — funcionalidades técnicas do sistema
- "benefits": array de strings (máx. 5 itens) — benefícios diretos ao usuário final
- "use_cases": array de strings (máx. 4 itens) — casos de uso práticos e exemplos reais
- "technical_summary": string (máx. 200 chars) — descrição técnica densa para documentação
- "ai_context": string (máx. 300 chars) — contexto otimizado para treinamento de IA, em formato factual e objetivo

Retorne SOMENTE o JSON, sem markdown, sem explicação.`,
      response_json_schema: {
        type: 'object',
        properties: {
          features: { type: 'array', items: { type: 'string' } },
          benefits: { type: 'array', items: { type: 'string' } },
          use_cases: { type: 'array', items: { type: 'string' } },
          technical_summary: { type: 'string' },
          ai_context: { type: 'string' },
        },
      },
    });

    return result;
  };

  /**
   * Inicia a análise em lote de todos os apps ativos.
   * Processa em paralelo com controle de progresso.
   */
  const handleAnalyzeAll = async () => {
    setIsAnalyzing(true);
    setProgress({ done: 0, total: activeApps.length });

    // Inicializa todos como "loading"
    const initMap = {};
    activeApps.forEach(app => { initMap[app.id] = { status: 'loading' }; });
    setAnalysisMap(initMap);

    // Processa em paralelo (batches de 3 para não sobrecarregar)
    const BATCH_SIZE = 3;
    let done = 0;

    for (let i = 0; i < activeApps.length; i += BATCH_SIZE) {
      const batch = activeApps.slice(i, i + BATCH_SIZE);
      await Promise.all(batch.map(async (app) => {
        const data = await analyzeApp(app);
        done++;
        setProgress(p => ({ ...p, done }));
        setAnalysisMap(prev => ({
          ...prev,
          [app.id]: { status: 'done', ...data },
        }));
      }));
    }

    setIsAnalyzing(false);
  };

  /**
   * Constrói o payload JSON exportável para treinamento da IA.
   * Inclui todos os metadados + análise LLM para cada app.
   */
  const buildExportPayload = () => {
    return {
      export_meta: {
        generated_at: new Date().toISOString(),
        total_apps: activeApps.length,
        analyzed_apps: Object.values(analysisMap).filter(v => v.status === 'done').length,
        source: 'Oren AI — Módulo de Inteligência de Apps',
      },
      apps: activeApps.map(app => ({
        id: app.id,
        title: app.title,
        url: app.url,
        category: app.category,
        workspace: wsMap[app.workspace_id] || 'N/A',
        tags: app.tags || [],
        card_summary: app.card_summary || '',
        description_raw: app.description?.replace(/<[^>]*>/g, '').trim() || '',
        analysis: analysisMap[app.id]?.status === 'done'
          ? {
              features: analysisMap[app.id].features || [],
              benefits: analysisMap[app.id].benefits || [],
              use_cases: analysisMap[app.id].use_cases || [],
              technical_summary: analysisMap[app.id].technical_summary || '',
              ai_context: analysisMap[app.id].ai_context || '',
            }
          : null,
      })),
    };
  };

  const handleExportJSON = () => {
    const payload = buildExportPayload();
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `isa-training-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyJSON = async () => {
    const payload = buildExportPayload();
    await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleExpand = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const analyzedCount = Object.values(analysisMap).filter(v => v.status === 'done').length;
  const hasAnyAnalysis = analyzedCount > 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-[2rem] border ${isDarkMode ? 'bg-slate-900/40 border-slate-800/50' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className={`text-xl font-black uppercase italic tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Inteligência de Apps
            </h2>
            <p className={`text-[11px] font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              {activeApps.length} apps ativos · {analyzedCount} analisados
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {hasAnyAnalysis && (
            <>
              <button
                onClick={handleCopyJSON}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${isDarkMode ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-500 hover:bg-slate-100'}`}
              >
                {copied ? <CheckCheck className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copiado!' : 'Copiar JSON'}
              </button>
              <button
                onClick={handleExportJSON}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-lg"
              >
                <Download className="w-4 h-4" /> Exportar para Isa
              </button>
            </>
          )}
          <button
            onClick={handleAnalyzeAll}
            disabled={isAnalyzing}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${
              isAnalyzing
                ? 'bg-violet-500/20 text-violet-400 cursor-not-allowed animate-pulse'
                : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:opacity-90'
            }`}
          >
            {isAnalyzing
              ? <><RefreshCw className="w-4 h-4 animate-spin" /> Analisando {progress.done}/{progress.total}…</>
              : <><Sparkles className="w-4 h-4" /> {hasAnyAnalysis ? 'Re-Analisar Tudo' : 'Analisar com IA'}</>
            }
          </button>
        </div>
      </div>

      {/* Progress bar */}
      {isAnalyzing && (
        <div className={`h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
          <div
            className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 transition-all duration-500 rounded-full"
            style={{ width: `${progress.total > 0 ? (progress.done / progress.total) * 100 : 0}%` }}
          />
        </div>
      )}

      {/* Empty state */}
      {activeApps.length === 0 && (
        <div className={`flex flex-col items-center justify-center py-24 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
          <Brain className="w-10 h-10 mb-4 opacity-30" />
          <p className="text-sm font-black uppercase tracking-widest opacity-60">Nenhum aplicativo encontrado</p>
        </div>
      )}

      {/* App cards */}
      <div className="space-y-3">
        {activeApps.map(app => {
          const analysis = analysisMap[app.id];
          const isLoading = analysis?.status === 'loading';
          const isDone = analysis?.status === 'done';
          const isOpen = expanded[app.id];

          return (
            <div
              key={app.id}
              className={`rounded-[1.5rem] border overflow-hidden transition-all duration-300 ${
                isDarkMode ? 'border-slate-800/60 bg-slate-900/30' : 'border-slate-200 bg-white'
              } ${isDone ? (isDarkMode ? 'border-violet-500/20' : 'border-violet-200') : ''}`}
            >
              {/* App row header */}
              <button
                className="w-full flex items-center gap-4 px-6 py-4 text-left"
                onClick={() => isDone && toggleExpand(app.id)}
              >
                <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-[10px] font-black uppercase ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
                  {app.title.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-black uppercase italic leading-none truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{app.title}</p>
                  <p className={`text-[10px] font-bold mt-0.5 truncate ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    {app.category} · {wsMap[app.workspace_id] || '—'}
                  </p>
                </div>

                {/* Tags */}
                {(app.tags || []).length > 0 && (
                  <div className="hidden sm:flex items-center gap-1 flex-shrink-0">
                    <Tag className={`w-3 h-3 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`} />
                    <span className={`text-[10px] font-bold ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>{app.tags.slice(0, 2).join(', ')}</span>
                  </div>
                )}

                {/* Status badge */}
                <div className="flex-shrink-0">
                  {isLoading ? (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 text-[10px] font-black animate-pulse">
                      <RefreshCw className="w-3 h-3 animate-spin" /> Analisando…
                    </span>
                  ) : isDone ? (
                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-700'}`}>
                      <Sparkles className="w-3 h-3" /> Pronto
                    </span>
                  ) : (
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black ${isDarkMode ? 'bg-slate-800 text-slate-600' : 'bg-slate-100 text-slate-400'}`}>
                      Pendente
                    </span>
                  )}
                </div>

                {/* Expand icon */}
                {isDone && (
                  isOpen
                    ? <ChevronDown className={`w-4 h-4 flex-shrink-0 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                    : <ChevronRight className={`w-4 h-4 flex-shrink-0 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                )}
              </button>

              {/* Expanded analysis */}
              {isDone && isOpen && (
                <div className={`px-6 pb-6 border-t ${isDarkMode ? 'border-slate-800/50' : 'border-slate-100'}`}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">

                    {/* Funcionalidades */}
                    <AnalysisSection
                      isDarkMode={isDarkMode}
                      title="Funcionalidades"
                      color="blue"
                      items={analysis.features}
                    />

                    {/* Benefícios */}
                    <AnalysisSection
                      isDarkMode={isDarkMode}
                      title="Benefícios"
                      color="emerald"
                      items={analysis.benefits}
                    />

                    {/* Casos de uso */}
                    <AnalysisSection
                      isDarkMode={isDarkMode}
                      title="Casos de Uso"
                      color="amber"
                      items={analysis.use_cases}
                    />

                    {/* Contexto IA */}
                    <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-violet-500/5 border-violet-500/15' : 'bg-violet-50 border-violet-100'}`}>
                      <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${isDarkMode ? 'text-violet-400' : 'text-violet-600'}`}>
                        Contexto para IA
                      </p>
                      <p className={`text-[12px] leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        {analysis.ai_context}
                      </p>
                    </div>
                  </div>

                  {/* Resumo técnico */}
                  {analysis.technical_summary && (
                    <div className={`mt-4 p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-800/40 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
                      <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Resumo Técnico</p>
                      <p className={`text-[12px] font-medium leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{analysis.technical_summary}</p>
                    </div>
                  )}

                  {/* Rodapé: link + export individual */}
                  <div className="mt-4 flex items-center gap-4 flex-wrap">
                    <a
                      href={app.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                    >
                      <ExternalLink className="w-3 h-3" /> Acessar Aplicativo
                    </a>

                    {/* Exporta JSON apenas deste app */}
                    <button
                      onClick={() => {
                        const payload = {
                          export_meta: {
                            generated_at: new Date().toISOString(),
                            source: 'Oren AI — Inteligência de Apps',
                            app_id: app.id,
                          },
                          app: {
                            id: app.id,
                            title: app.title,
                            url: app.url,
                            category: app.category,
                            workspace: wsMap[app.workspace_id] || 'N/A',
                            tags: app.tags || [],
                            card_summary: app.card_summary || '',
                            description_raw: app.description?.replace(/<[^>]*>/g, '').trim() || '',
                            analysis: {
                              features: analysis.features || [],
                              benefits: analysis.benefits || [],
                              use_cases: analysis.use_cases || [],
                              technical_summary: analysis.technical_summary || '',
                              ai_context: analysis.ai_context || '',
                            },
                          },
                        };
                        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${app.title.toLowerCase().replace(/\s+/g, '-')}-isa.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                        isDarkMode
                          ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white hover:border-emerald-500'
                          : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white hover:border-emerald-600'
                      }`}
                    >
                      <Download className="w-3.5 h-3.5" /> Exportar JSON
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * AnalysisSection
 * Componente auxiliar para renderizar listas de análise com cor temática.
 */
function AnalysisSection({ isDarkMode, title, color, items = [] }) {
  const colorMap = {
    blue: { bg: isDarkMode ? 'bg-blue-500/5 border-blue-500/15' : 'bg-blue-50 border-blue-100', label: isDarkMode ? 'text-blue-400' : 'text-blue-600', dot: 'bg-blue-500' },
    emerald: { bg: isDarkMode ? 'bg-emerald-500/5 border-emerald-500/15' : 'bg-emerald-50 border-emerald-100', label: isDarkMode ? 'text-emerald-400' : 'text-emerald-600', dot: 'bg-emerald-500' },
    amber: { bg: isDarkMode ? 'bg-amber-500/5 border-amber-500/15' : 'bg-amber-50 border-amber-100', label: isDarkMode ? 'text-amber-400' : 'text-amber-600', dot: 'bg-amber-500' },
  };
  const c = colorMap[color];

  return (
    <div className={`p-4 rounded-2xl border ${c.bg}`}>
      <p className={`text-[10px] font-black uppercase tracking-widest mb-3 ${c.label}`}>{title}</p>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot}`} />
            <span className={`text-[12px] leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}