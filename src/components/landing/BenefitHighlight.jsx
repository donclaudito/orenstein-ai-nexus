import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const benefits = [
  'Onboarding em menos de 5 minutos, sem treinamento técnico',
  'Suporte especializado em saúde digital 24/7',
  'Atualizações contínuas sem interrupção do serviço',
  'Integrações com os principais sistemas de saúde do Brasil',
  'Controle total de permissões por perfil de usuário',
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
              Construído por<br />médicos, para<br />médicos
            </h2>
            <p className="text-slate-500 text-base leading-relaxed mb-10 max-w-lg">
              Nossa plataforma foi desenhada em parceria com profissionais de saúde reais.
              Cada decisão de design prioriza a redução de fricção clínica e a segurança do paciente.
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

          {/* Visual side */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: '500+', label: 'Profissionais ativos', bg: 'bg-blue-600', text: 'text-white' },
              { value: '99.9%', label: 'Uptime garantido', bg: 'bg-slate-900', text: 'text-white' },
              { value: '< 5min', label: 'Tempo de onboarding', bg: 'bg-white', text: 'text-slate-900', border: true },
              { value: '0', label: 'Incidentes de segurança', bg: 'bg-emerald-500', text: 'text-white' },
            ].map((s, i) => (
              <div
                key={i}
                className={`${s.bg} ${s.text} ${s.border ? 'border border-slate-200' : ''} rounded-2xl p-8 flex flex-col gap-2 shadow-sm`}
              >
                <span className="text-4xl font-black tracking-tight">{s.value}</span>
                <span className="text-sm font-medium opacity-80">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}