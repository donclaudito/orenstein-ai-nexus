import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const benefits = [
  'AI Scribe ouve e documenta consultas automaticamente em tempo real',
  'Copilotos clínicos integrados para suporte em UTIs e pronto-socorros',
  'IA Agêntica que gerencia fluxos de pacientes e valida faturamento sozinha',
  'Monitoramento ativo do bem-estar médico — detecta sinais de burnout',
  'Integrações com prontuários eletrônicos líderes do mercado brasileiro',
  'Controle granular de permissões por perfil com auditoria total',
];

export default function BenefitHighlight() {
  return (
    <section id="diferenciais" className="py-24 sm:py-36 px-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Text side */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-3">Por que Orenstein AI?</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight mb-6">
              IA que trabalha<br />para o médico,<br />não o contrário
            </h2>
            <p className="text-slate-500 text-base leading-relaxed mb-10 max-w-lg">
              De AI Scribes que eliminam a digitação até copilotos clínicos que apoiam decisões em plantões de UTI —
              cada ferramenta foi pensada para devolver tempo clínico e reduzir a fadiga do profissional de saúde.
            </p>
            <ul className="space-y-4">
              {benefits.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <a
                href="/"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 hover:scale-105 active:scale-95"
              >
                Solicitar demonstração
              </a>
            </div>
          </div>

          {/* Visual side — case study cards */}
          <div className="space-y-4">
            <div className="bg-blue-600 text-white rounded-2xl p-7 shadow-lg">
              <p className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-3">Caso Real · Sabará Hospital Infantil</p>
              <div className="flex gap-6 mb-4">
                <div>
                  <p className="text-4xl font-black">60%</p>
                  <p className="text-sm opacity-80 mt-1">menos fadiga mental</p>
                </div>
                <div>
                  <p className="text-4xl font-black">78%</p>
                  <p className="text-sm opacity-80 mt-1">melhor vínculo com famílias</p>
                </div>
              </div>
              <p className="text-sm opacity-70 leading-relaxed">AI Scribe implantado com resultado imediato na qualidade de vida dos médicos e na relação com pacientes.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col gap-1 shadow-sm">
                <span className="text-3xl font-black">40%+</span>
                <span className="text-sm opacity-70">menos burocracia</span>
              </div>
              <div className="bg-white border border-slate-200 text-slate-900 rounded-2xl p-6 flex flex-col gap-1 shadow-sm">
                <span className="text-3xl font-black text-emerald-600">Milhares</span>
                <span className="text-sm text-slate-500">de horas clínicas economizadas</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}