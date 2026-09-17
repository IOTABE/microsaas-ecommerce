import Link from 'next/link';
import { Store, Shield, ArrowRight, Sparkles } from 'lucide-react';
import { DEMO_TENANTS } from '@/lib/tenant';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50/80 relative overflow-hidden flex flex-col items-center justify-center p-6">
      {/* Esferas de Fundo para o Glassmorphism */}
      <div className="absolute top-10 left-10 w-96 h-96 rounded-full blur-3xl opacity-20 bg-blue-500 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full blur-3xl opacity-20 bg-pink-500 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl opacity-15 bg-amber-400 pointer-events-none" />

      <div className="max-w-3xl w-full text-center space-y-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-white/80 text-blue-700 text-xs font-bold shadow-glass">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Micro App SaaS Multitenant Ativo • Material You & Glassmorphism</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight">
          E-commerce & CRM Multitenant
        </h1>
        <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          Plataforma com isolamento multitenant, vitrines personalizadas com branding dinâmico,
          receptor de leads, carrinho inteligente e automação pós-venda.
        </p>

        {/* Escolha de Demonstração em Cards Glassmorphism */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left max-w-2xl mx-auto pt-2">
          {Object.values(DEMO_TENANTS).map((tenant) => (
            <Link
              key={tenant.slug}
              href={`/${tenant.slug}`}
              className="glass-card p-6 shadow-glass hover:shadow-glass-hover hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition"
                    style={{ backgroundColor: tenant.branding?.primaryColor || '#2563eb' }}
                  >
                    <Store className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono bg-white/60 px-2.5 py-1 rounded-full text-slate-600 border border-slate-200/50">
                    /{tenant.slug}
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-base group-hover:text-blue-600 transition">
                  {tenant.companyName}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Vitrine com paleta de cores customizada, receptor de leads na home e frete grátis &ge; R$ 150.
                </p>
              </div>

              <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-blue-600 group-hover:translate-x-1 transition">
                <span>Acessar Loja</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>

        <div className="pt-4 flex items-center justify-center gap-4">
          <Link
            href="/admin"
            className="m3-button inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-xs font-bold hover:bg-black shadow-sm"
          >
            <Shield className="w-4 h-4 text-blue-400" />
            <span>Acessar Painel Administrativo</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
