import React from 'react';
import { ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-24 sm:pt-44 sm:pb-36 px-6 overflow-hidden bg-white">
      {/* Subtle background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      {/* Gradient blob */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50 rounded-full blur-[120px] opacity-70 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-8 tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          AI Scribe · Documentação Clínica Automatizada
        </div>

        {/* H1 */}
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] text-slate-900 mb-6">
          Menos<br />
          <span className="text-blue-600">burocracia,</span><br />
          mais paciente
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
          A IA ouve a consulta, identifica os papéis na conversa e gera sumários estruturados automaticamente no prontuário — reduzindo mais de <strong className="text-slate-700 font-semibold">40% do tempo burocrático</strong> e devolvendo o médico ao centro do cuidado.
        </p>

        {/* Impact bar */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mb-10">
          {[
            { value: '60%', label: 'menos fadiga mental', color: 'text-blue-600' },
            { value: '78%', label: 'melhor vínculo com pacientes', color: 'text-emerald-600' },
            { value: '40%+', label: 'menos tempo burocrático', color: 'text-violet-600' },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-slate-200 shadow-sm">
              <span className={`text-lg font-black ${s.color}`}>{s.value}</span>
              <span className="text-xs text-slate-500 font-medium">{s.label}</span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a
            href="/"
            className="flex items-center gap-2 px-8 py-4 rounded-full bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 hover:scale-105 active:scale-95"
          >
            Começar gratuitamente <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#funcionalidades"
            className="flex items-center gap-2 px-8 py-4 rounded-full border border-slate-200 text-slate-600 font-semibold text-sm hover:border-slate-300 hover:text-slate-900 transition-all"
          >
            Ver funcionalidades
          </a>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
          {[
            { icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />, label: 'LGPD Compliant' },
            { icon: <Zap className="w-4 h-4 text-blue-500" />, label: 'Onboarding em 5 minutos' },
            { icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />, label: 'Validado no Sabará Hospital Infantil' },
          ].map((b, i) => (
            <div key={i} className="flex items-center gap-1.5">
              {b.icon}
              <span>{b.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}