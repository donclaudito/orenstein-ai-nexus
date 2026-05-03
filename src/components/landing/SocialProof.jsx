import React from 'react';

const stats = [
  { value: '500+', label: 'Profissionais ativos' },
  { value: '99.9%', label: 'Uptime garantido' },
  { value: '< 5min', label: 'Tempo de onboarding' },
  { value: '0', label: 'Incidentes de segurança' },
];

export default function SocialProof() {
  return (
    <section className="py-16 sm:py-20 border-y border-slate-100 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-400 mb-10">
          Confiado por equipes clínicas em todo o Brasil
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">{s.value}</p>
              <p className="text-sm text-slate-500 mt-2 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}