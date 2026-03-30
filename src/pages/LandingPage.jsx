import React, { useState, useEffect } from 'react';
import { Shield, Zap, Brain, ChevronRight, CheckCircle, Star, ArrowRight, Heart, Lock, Activity } from 'lucide-react';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans overflow-x-hidden">

      {/* NAV */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/60 shadow-xl' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-lg font-black italic uppercase tracking-tighter text-white">Orenstein AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Funcionalidades</a>
            <a href="#diferenciais" className="hover:text-white transition-colors">Diferenciais</a>
            <a href="#depoimentos" className="hover:text-white transition-colors">Depoimentos</a>
          </div>
          <a
            href="#cta"
            className="px-5 sm:px-7 py-2.5 sm:py-3 rounded-full bg-white text-slate-950 text-[10px] sm:text-xs font-black uppercase tracking-widest hover:bg-blue-50 transition-all shadow-xl shadow-white/10 hover:scale-105 active:scale-95"
          >
            Solicitar Acesso
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-20 overflow-hidden">
        {/* Glow background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.25em] mb-10">
            <Activity className="w-3 h-3" />
            Plataforma Clínica com Inteligência Artificial
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black italic uppercase tracking-tighter leading-[0.9] mb-8">
            Medicina<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400">
              Potencializada
            </span>
            <br />por IA
          </h1>

          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-12 font-medium">
            O Orenstein AI centraliza todos os aplicativos clínicos da sua equipe num único hub inteligente. Menos tempo navegando, mais tempo cuidando de pacientes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#cta"
              className="flex items-center gap-3 px-8 py-4 rounded-full bg-white text-slate-950 text-xs font-black uppercase tracking-widest hover:bg-blue-50 transition-all shadow-2xl shadow-white/10 hover:scale-105 active:scale-95"
            >
              Começar Agora <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#features"
              className="flex items-center gap-3 px-8 py-4 rounded-full border border-slate-700 text-slate-300 text-xs font-black uppercase tracking-widest hover:border-slate-500 hover:text-white transition-all"
            >
              Ver Funcionalidades
            </a>
          </div>

          {/* Social proof mini */}
          <div className="flex items-center justify-center gap-2 mt-14 text-slate-500 text-xs font-bold">
            <div className="flex -space-x-2">
              {['bg-blue-500','bg-indigo-500','bg-violet-500','bg-pink-500'].map((c, i) => (
                <div key={i} className={`w-7 h-7 rounded-full border-2 border-slate-950 ${c}`} />
              ))}
            </div>
            <span>+500 médicos e equipes clínicas já utilizam</span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-40">
          <div className="w-px h-10 bg-slate-500" />
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Scroll</span>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 sm:py-36 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 sm:mb-24">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-4">Funcionalidades</p>
            <h2 className="text-4xl sm:text-5xl font-black italic uppercase tracking-tighter leading-tight">
              Tudo que sua equipe<br />precisa, num só lugar
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: <Brain className="w-7 h-7" />,
                color: 'blue',
                title: 'Hub de Aplicativos Clínicos',
                desc: 'Centralize todos os sistemas da sua clínica — prontuário, faturamento, protocolos — num único painel organizado por especialidade.',
                tag: 'Organização',
              },
              {
                icon: <Zap className="w-7 h-7" />,
                color: 'indigo',
                title: 'Acesso Instantâneo',
                desc: 'Abra qualquer aplicativo clínico com um clique, sem precisar lembrar senhas ou navegar entre abas. Fluxo de trabalho desimpedido.',
                tag: 'Velocidade',
              },
              {
                icon: <Shield className="w-7 h-7" />,
                color: 'violet',
                title: 'Segurança & Conformidade',
                desc: 'Arquitetura em conformidade com LGPD e HIPAA. Dados dos pacientes protegidos com criptografia de ponta a ponta e controle de acesso granular.',
                tag: 'Segurança',
              },
            ].map((f, i) => (
              <div
                key={i}
                className="group relative bg-slate-900/40 border border-slate-800/60 rounded-[2.5rem] p-8 sm:p-10 hover:border-blue-500/40 hover:-translate-y-2 transition-all duration-500 overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-40 h-40 rounded-full blur-[80px] opacity-0 group-hover:opacity-30 transition-opacity duration-700 ${
                  f.color === 'blue' ? 'bg-blue-500' : f.color === 'indigo' ? 'bg-indigo-500' : 'bg-violet-500'
                }`} />
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border text-white ${
                  f.color === 'blue' ? 'bg-blue-600/20 border-blue-500/30' : f.color === 'indigo' ? 'bg-indigo-600/20 border-indigo-500/30' : 'bg-violet-600/20 border-violet-500/30'
                }`}>
                  {f.icon}
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest mb-4 block ${
                  f.color === 'blue' ? 'text-blue-400' : f.color === 'indigo' ? 'text-indigo-400' : 'text-violet-400'
                }`}>{f.tag}</span>
                <h3 className="text-xl font-black tracking-tight text-white mb-4 uppercase italic">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section id="diferenciais" className="py-24 sm:py-36 px-6 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-4">Por que Orenstein AI?</p>
              <h2 className="text-4xl sm:text-5xl font-black italic uppercase tracking-tighter leading-tight mb-8">
                Construído por<br />médicos, para<br />médicos
              </h2>
              <p className="text-slate-400 text-base leading-relaxed mb-10 font-medium max-w-lg">
                Nossa plataforma foi desenhada em parceria com profissionais de saúde reais. Cada decisão de design prioriza a redução de fricção clínica e a segurança do paciente.
              </p>
              <div className="space-y-5">
                {[
                  'Onboarding em menos de 5 minutos',
                  'Suporte especializado em saúde 24/7',
                  'Atualizações contínuas sem interrupção do serviço',
                  'Integrações com os principais sistemas de saúde do Brasil',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-slate-300 text-sm font-bold">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-5">
              {[
                { value: '500+', label: 'Profissionais Ativos', color: 'blue' },
                { value: '99.9%', label: 'Uptime Garantido', color: 'emerald' },
                { value: '<5min', label: 'Tempo de Onboarding', color: 'indigo' },
                { value: '0', label: 'Incidentes de Segurança', color: 'violet' },
              ].map((s, i) => (
                <div
                  key={i}
                  className="bg-slate-900/50 border border-slate-800/60 rounded-[2rem] p-8 flex flex-col gap-3 hover:border-blue-500/30 transition-all"
                >
                  <span className={`text-4xl font-black tracking-tighter ${
                    s.color === 'blue' ? 'text-blue-400' :
                    s.color === 'emerald' ? 'text-emerald-400' :
                    s.color === 'indigo' ? 'text-indigo-400' : 'text-violet-400'
                  }`}>{s.value}</span>
                  <span className="text-slate-400 text-xs font-black uppercase tracking-widest">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section id="depoimentos" className="py-24 sm:py-36 px-6 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400 mb-4">Depoimentos</p>
            <h2 className="text-4xl sm:text-5xl font-black italic uppercase tracking-tighter">Quem usa, confia</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Dra. Fernanda Luz',
                role: 'Clínica Geral · São Paulo',
                text: 'Reduzi em 40% o tempo que perdia procurando aplicativos. Agora tudo está num painel só, organizado pela minha equipe.',
              },
              {
                name: 'Dr. Marcos Andrade',
                role: 'Cirurgião · Rio de Janeiro',
                text: 'A segurança me deu tranquilidade. Sei que os dados dos meus pacientes estão protegidos sem precisar me preocupar com infraestrutura.',
              },
              {
                name: 'Equipe HCM',
                role: 'Hospital Central de Medicina',
                text: 'Implantamos para 80 médicos em uma semana. O suporte foi excepcional — alguém que realmente entende o ambiente hospitalar.',
              },
            ].map((t, i) => (
              <div key={i} className="bg-slate-900/40 border border-slate-800/60 rounded-[2.5rem] p-8 hover:border-amber-500/20 transition-all">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-8 font-medium italic">"{t.text}"</p>
                <div>
                  <p className="text-white font-black text-sm uppercase tracking-tight">{t.name}</p>
                  <p className="text-slate-500 text-[11px] font-bold mt-1">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="py-24 sm:py-36 px-6 border-t border-slate-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative bg-gradient-to-br from-blue-600/20 via-indigo-600/10 to-violet-600/20 border border-blue-500/20 rounded-[3rem] p-12 sm:p-20 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px]" />
            </div>
            <div className="relative z-10">
              <Heart className="w-10 h-10 text-blue-400 mx-auto mb-8" />
              <h2 className="text-4xl sm:text-6xl font-black italic uppercase tracking-tighter leading-tight mb-6">
                Pronto para transformar<br />sua clínica?
              </h2>
              <p className="text-slate-400 text-base leading-relaxed mb-12 max-w-xl mx-auto font-medium">
                Junte-se a centenas de profissionais que já otimizaram seu fluxo de trabalho. Comece gratuitamente, sem cartão de crédito.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/"
                  className="flex items-center justify-center gap-3 px-10 py-5 rounded-full bg-white text-slate-950 text-xs font-black uppercase tracking-widest hover:bg-blue-50 transition-all shadow-2xl shadow-white/10 hover:scale-105 active:scale-95"
                >
                  Acessar Plataforma <ChevronRight className="w-4 h-4" />
                </a>
              </div>
              <p className="text-slate-600 text-[11px] font-bold mt-8 flex items-center justify-center gap-2">
                <Lock className="w-3 h-3" /> Dados protegidos com criptografia · LGPD Compliant
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/50 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-600 text-[11px] font-bold">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="font-black italic uppercase tracking-tighter text-slate-400">Orenstein AI</span>
          </div>
          <span>© {new Date().getFullYear()} Orenstein AI · Todos os direitos reservados</span>
          <span className="text-slate-700">LGPD · Privacidade · Termos</span>
        </div>
      </footer>
    </div>
  );
}