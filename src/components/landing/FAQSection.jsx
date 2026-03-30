import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    q: 'O Orenstein AI é seguro para dados de pacientes?',
    a: 'Sim. Nossa plataforma segue rigorosamente a LGPD e os padrões HIPAA. Todos os dados são criptografados em trânsito e em repouso, com controle de acesso granular por perfil de usuário.',
  },
  {
    q: 'Quanto tempo leva para implementar na minha clínica?',
    a: 'O onboarding leva menos de 5 minutos para o primeiro usuário. Para equipes maiores, oferecemos um processo guiado com suporte dedicado, geralmente concluído em 1 dia útil.',
  },
  {
    q: 'Posso integrar com meu sistema de prontuário atual?',
    a: 'Sim. O Orenstein AI integra com os principais sistemas de prontuário eletrônico do mercado brasileiro, incluindo MV, Tasy, Soul MV, entre outros.',
  },
  {
    q: 'Há limite de usuários ou aplicativos?',
    a: 'Não há limite técnico. Nossos planos se adaptam ao tamanho da sua equipe, de consultórios individuais a hospitais com centenas de profissionais.',
  },
  {
    q: 'Qual é o custo para começar?',
    a: 'Oferecemos um plano gratuito para equipes de até 3 usuários. Para clínicas maiores, entre em contato para uma proposta personalizada.',
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState(null);

  return (
    <section id="faq" className="py-24 sm:py-36 px-6 bg-slate-50">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">FAQ</p>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">Perguntas frequentes</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`bg-white rounded-2xl border transition-all duration-200 ${
                open === i ? 'border-slate-200 shadow-sm' : 'border-slate-100 hover:border-slate-200'
              }`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
              >
                <span className="text-sm font-semibold text-slate-900">{faq.q}</span>
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                  {open === i ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </span>
              </button>
              {open === i && (
                <div className="px-6 pb-6">
                  <p className="text-sm text-slate-500 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}