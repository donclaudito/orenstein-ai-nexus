import React from 'react';
import { Shield, ArrowRight } from 'lucide-react';

export default function LandingFooter() {
  return (
    <>
      {/* CTA Banner */}
      <section id="cta" className="py-24 sm:py-32 px-6 bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-4">Comece hoje</p>
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight mb-6">
            Pronto para transformar<br />sua clínica?
          </h2>
          <p className="text-slate-400 text-base leading-relaxed mb-10 max-w-xl mx-auto">
            Junte-se a centenas de profissionais que já otimizaram seu fluxo de trabalho.
            Comece gratuitamente, sem cartão de crédito.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-10 py-5 rounded-full bg-white text-slate-900 font-bold text-sm hover:bg-blue-50 transition-all shadow-2xl shadow-black/30 hover:scale-105 active:scale-95"
          >
            Acessar Plataforma <ArrowRight className="w-4 h-4" />
          </a>
          <p className="text-slate-600 text-xs mt-6 flex items-center justify-center gap-2">
            <Shield className="w-3.5 h-3.5" />
            Dados protegidos com criptografia · LGPD Compliant · Sem cartão de crédito
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-12 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="sm:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
                <span className="text-sm font-black tracking-tight text-white">Orenstein <span className="text-blue-400">AI</span></span>
              </div>
              <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
                Hub de aplicativos clínicos com inteligência artificial. Desenvolvido para equipes de saúde exigentes.
              </p>
            </div>

            {/* Links col 1 */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Produto</p>
              <ul className="space-y-2">
                {['Funcionalidades', 'Segurança', 'Integrações', 'Preços'].map(l => (
                  <li key={l}><a href="#" className="text-sm text-slate-500 hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>

            {/* Links col 2 */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Empresa</p>
              <ul className="space-y-2">
                {['Sobre nós', 'Blog', 'Contato', 'Termos de Uso'].map(l => (
                  <li key={l}><a href="#" className="text-sm text-slate-500 hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-600 text-xs">© {new Date().getFullYear()} Orenstein AI. Todos os direitos reservados.</p>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              LGPD · Privacidade · Segurança
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}