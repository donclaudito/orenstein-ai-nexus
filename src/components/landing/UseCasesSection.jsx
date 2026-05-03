import React, { useState } from 'react';
import { Mic, Brain, Bot, HeartPulse, ChevronRight } from 'lucide-react';

const cases = [
  {
    icon: <Mic className="w-6 h-6" />,
    tag: 'AI Scribe',
    color: 'blue',
    title: 'Documentação automática por voz',
    desc: 'A IA ouve a consulta, identifica médico e paciente na conversa e gera o sumário estruturado diretamente no prontuário eletrônico — sem digitação, sem interrupção do atendimento.',
    metric: '40%+',
    metricLabel: 'menos tempo em burocracia',
    highlight: 'No Sabará Hospital Infantil, 60% dos médicos relataram menor fadiga mental e 78% melhor vínculo com as famílias.',
  },
  {
    icon: <Brain className="w-6 h-6" />,
    tag: 'Copiloto Clínico',
    color: 'violet',
    title: 'Apoio à decisão em tempo real',
    desc: 'Copilotos integrados respondem perguntas baseadas em protocolos durante plantões noturnos em UTIs e analisam radiografias de tórax em pronto-socorros, marcando achados nas imagens em minutos.',
    metric: 'Milhares',
    metricLabel: 'de horas clínicas economizadas',
    highlight: 'Suporte ativo sem quebrar o fluxo de trabalho do profissional — disponível 24h, no sistema que ele já usa.',
  },
  {
    icon: <Bot className="w-6 h-6" />,
    tag: 'IA Agêntica',
    color: 'emerald',
    title: 'Automação de processos administrativos',
    desc: 'Sistemas proativos que gerenciam fluxos de pacientes, avaliam centenas de prontuários automaticamente e validam dados de faturamento — sem precisar de comando humano.',
    metric: '100s',
    metricLabel: 'de prontuários avaliados por hora',
    highlight: 'A redução do trabalho administrativo devolve tempo real para o cuidado clínico e reduz erros de faturamento.',
  },
  {
    icon: <HeartPulse className="w-6 h-6" />,
    tag: 'Bem-estar Médico',
    color: 'rose',
    title: 'Monitoramento ativo de burnout',
    desc: 'A IA analisa padrões de trabalho, carga de turnos e sinais de esgotamento para oferecer insights precisos e intervenções direcionadas ao bem-estar do profissional.',
    metric: 'Prevenção',
    metricLabel: 'antes do colapso',
    highlight: 'Identificação precoce de médicos em risco de burnout com recomendações personalizadas de ajuste de carga.',
  },
];

const colorMap = {
  blue:   { bg: 'bg-blue-50',   icon: 'text-blue-600',   border: 'border-blue-100',   tag: 'bg-blue-100 text-blue-700',   metric: 'text-blue-600' },
  violet: { bg: 'bg-violet-50', icon: 'text-violet-600', border: 'border-violet-100', tag: 'bg-violet-100 text-violet-700', metric: 'text-violet-600' },
  emerald:{ bg: 'bg-emerald-50',icon: 'text-emerald-600',border: 'border-emerald-100',tag: 'bg-emerald-100 text-emerald-700',metric: 'text-emerald-600' },
  rose:   { bg: 'bg-rose-50',   icon: 'text-rose-600',   border: 'border-rose-100',   tag: 'bg-rose-100 text-rose-700',   metric: 'text-rose-600' },
};

export default function UseCasesSection() {
  const [active, setActive] = useState(0);
  const c = colorMap[cases[active].color];

  return (
    <section id="casos" className="py-24 sm:py-36 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="max-w-xl mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3">Casos de Uso</p>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            IA que age,<br />não só responde
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Tab nav */}
          <div className="lg:col-span-2 flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {cases.map((item, i) => {
              const cm = colorMap[item.color];
              return (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`flex items-center gap-3 px-5 py-4 rounded-2xl text-left transition-all duration-200 border flex-shrink-0 lg:flex-shrink ${
                    active === i
                      ? `${cm.bg} ${cm.border} shadow-sm`
                      : 'border-transparent hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${active === i ? cm.bg : 'bg-slate-100'} ${active === i ? cm.icon : 'text-slate-400'} border ${active === i ? cm.border : 'border-transparent'}`}>
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-0.5 ${active === i ? cm.icon : 'text-slate-400'}`}>{item.tag}</p>
                    <p className={`text-sm font-bold leading-tight ${active === i ? 'text-slate-900' : 'text-slate-500'}`}>{item.title}</p>
                  </div>
                  {active === i && <ChevronRight className={`w-4 h-4 flex-shrink-0 hidden lg:block ${cm.icon}`} />}
                </button>
              );
            })}
          </div>

          {/* Detail panel */}
          <div className={`lg:col-span-3 rounded-3xl border p-8 sm:p-10 ${c.bg} ${c.border}`}>
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 ${c.tag}`}>
              {cases[active].icon}
              {cases[active].tag}
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mb-4">
              {cases[active].title}
            </h3>
            <p className="text-slate-600 text-base leading-relaxed mb-8">
              {cases[active].desc}
            </p>
            <div className="flex items-end gap-4 mb-6">
              <span className={`text-5xl font-black tracking-tight ${c.metric}`}>{cases[active].metric}</span>
              <span className="text-sm text-slate-500 font-medium pb-1.5 leading-tight max-w-[140px]">{cases[active].metricLabel}</span>
            </div>
            <div className={`rounded-2xl border px-6 py-4 ${c.border} bg-white/60`}>
              <p className="text-sm text-slate-600 leading-relaxed font-medium italic">
                "{cases[active].highlight}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}