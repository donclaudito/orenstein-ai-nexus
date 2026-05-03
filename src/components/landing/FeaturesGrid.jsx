import React from 'react';
import { Brain, Shield, Zap, LayoutGrid, Users, Lock, Mic } from 'lucide-react';

const features = [
  {
    icon: <LayoutGrid className="w-6 h-6" />,
    title: 'Hub Centralizado',
    desc: 'Todos os sistemas da sua clínica — prontuário, faturamento, protocolos — num único painel organizado por especialidade.',
    color: 'blue',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Acesso Instantâneo',
    desc: 'Abra qualquer aplicativo clínico com um clique. Sem senhas extras, sem navegação entre abas. Fluxo de trabalho desimpedido.',
    color: 'indigo',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Segurança LGPD',
    desc: 'Arquitetura em conformidade com LGPD e HIPAA. Dados dos pacientes protegidos com criptografia de ponta a ponta.',
    color: 'emerald',
  },
  {
    icon: <Mic className="w-6 h-6" />,
    title: 'AI Scribe — Documentação por Voz',
    desc: 'A IA ouve a consulta, identifica os papéis na conversa e gera sumários estruturados automaticamente no prontuário. 60% dos médicos relatam menor fadiga mental e 78% melhor vínculo com pacientes.',
    color: 'violet',
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: 'IA Clínica',
    desc: 'Resumos automáticos, sugestões de protocolos e assistência em evoluções médicas geradas por inteligência artificial.',
    color: 'pink',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Gestão de Equipes',
    desc: 'Controle granular de acesso por perfil. Médicos, enfermeiros e administradores com permissões distintas e auditáveis.',
    color: 'indigo',
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: 'Auditoria Total',
    desc: 'Log completo de todas as ações na plataforma. Rastreabilidade total para conformidade regulatória e investigações internas.',
    color: 'amber',
  },
];

const colorMap = {
  blue:   { bg: 'bg-blue-50',   icon: 'text-blue-600',   border: 'border-blue-100' },
  indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600', border: 'border-indigo-100' },
  emerald:{ bg: 'bg-emerald-50',icon: 'text-emerald-600',border: 'border-emerald-100' },
  violet: { bg: 'bg-violet-50', icon: 'text-violet-600', border: 'border-violet-100' },
  pink:   { bg: 'bg-pink-50',   icon: 'text-pink-600',   border: 'border-pink-100' },
  amber:  { bg: 'bg-amber-50',  icon: 'text-amber-600',  border: 'border-amber-100' },
};

export default function FeaturesGrid() {
  return (
    <section id="funcionalidades" className="py-24 sm:py-36 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="max-w-xl mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3">Funcionalidades</p>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Tudo que sua equipe<br />precisa, num só lugar
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const c = colorMap[f.color];
            return (
              <div
                key={i}
                className="group p-8 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-white"
              >
                <div className={`w-12 h-12 rounded-xl ${c.bg} border ${c.border} ${c.icon} flex items-center justify-center mb-6`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}