import React from 'react';

const stats = [
  { value: '60%', label: 'dos médicos com menor fadiga mental', sub: 'Sabará Hospital Infantil', color: 'text-blue-600' },
  { value: '78%', label: 'melhor vínculo com pacientes', sub: 'Sabará Hospital Infantil', color: 'text-emerald-600' },
  { value: '40%+', label: 'menos tempo em burocracia', sub: 'Média com AI Scribe', color: 'text-violet-600' },
  { value: '99.9%', label: 'Uptime garantido', sub: 'SLA plataforma', color: 'text-slate-900' },
];

export default function SocialProof() {
  return (
    <section className="py-16 sm:py-20 border-y border-slate-100 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-400 mb-10">
          Resultados comprovados em hospitais brasileiros
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <p className={`text-4xl sm:text-5xl font-black tracking-tight ${s.color}`}>{s.value}</p>
              <p className="text-sm text-slate-700 mt-2 font-semibold leading-tight">{s.label}</p>
              <p className="text-xs text-slate-400 mt-1">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}