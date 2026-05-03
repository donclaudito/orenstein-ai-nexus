import React, { useState, useEffect } from 'react';
import HeroSection from '../components/landing/HeroSection';
import SocialProof from '../components/landing/SocialProof';
import FeaturesGrid from '../components/landing/FeaturesGrid';
import BenefitHighlight from '../components/landing/BenefitHighlight';
import Testimonials from '../components/landing/Testimonials';
import FAQSection from '../components/landing/FAQSection';
import LandingFooter from '../components/landing/LandingFooter';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans overflow-x-hidden">

      {/* STICKY HEADER */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-slate-100'
          : 'bg-transparent'
      }`}>
        <div className="max-w-6xl mx-auto px-6 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <span className="text-lg font-black tracking-tight text-slate-900">Orenstein<span className="text-blue-600"> AI</span></span>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {['Funcionalidades', 'Diferenciais', 'Depoimentos', 'FAQ'].map(item => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="hidden sm:inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 hover:scale-105 active:scale-95"
            >
              Acessar Plataforma
            </a>
            <button
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <div className="w-5 h-0.5 bg-current mb-1" />
              <div className="w-5 h-0.5 bg-current mb-1" />
              <div className="w-5 h-0.5 bg-current" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-100 px-6 py-4 space-y-3">
            {['Funcionalidades', 'Diferenciais', 'Depoimentos', 'FAQ'].map(item => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium text-slate-600 hover:text-slate-900 py-1"
              >
                {item}
              </a>
            ))}
            <a
              href="/"
              className="block w-full text-center px-6 py-3 rounded-full bg-slate-900 text-white text-sm font-semibold mt-3"
            >
              Acessar Plataforma
            </a>
          </div>
        )}
      </header>

      {/* SECTIONS */}
      <HeroSection />
      <SocialProof />
      <FeaturesGrid />
      <BenefitHighlight />
      <Testimonials />
      <FAQSection />
      <LandingFooter />
    </div>
  );
}