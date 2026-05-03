import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Dra. Fernanda Luz',
    role: 'Clínica Geral · São Paulo',
    avatar: 'FL',
    color: 'bg-blue-100 text-blue-700',
    text: 'O AI Scribe mudou minha rotina. Saio do consultório sem pendências no prontuário — a IA já gerou o sumário enquanto eu ainda conversava com o paciente.',
  },
  {
    name: 'Dr. Marcos Andrade',
    role: 'Intensivista UTI · Rio de Janeiro',
    avatar: 'MA',
    color: 'bg-indigo-100 text-indigo-700',
    text: 'No plantão noturno, o copiloto clínico me responde baseado nos protocolos em segundos. É como ter um colega sênior sempre disponível, sem interromper meu fluxo.',
  },
  {
    name: 'Equipe Sabará Hospital Infantil',
    role: 'Hospital Infantil · São Paulo',
    avatar: 'SH',
    color: 'bg-emerald-100 text-emerald-700',
    text: '60% dos nossos médicos relataram menor sobrecarga cognitiva e 78% melhoraram o vínculo com as famílias. A documentação automatizada transformou a experiência de cuidado.',
  },
];

export default function Testimonials() {
  return (
    <section id="depoimentos" className="py-24 sm:py-36 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-500 mb-3">Depoimentos</p>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">Quem usa, confia</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl border border-slate-100 bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              {/* Quote */}
              <p className="text-slate-600 text-sm leading-relaxed mb-8">"{t.text}"</p>
              {/* Author */}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-xs font-black`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}