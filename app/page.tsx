import Link from 'next/link';
import { Store, Shield, ArrowRight, Sparkles, ShoppingBag } from 'lucide-react';
import { DEMO_TENANTS } from '@/lib/tenant';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl w-full text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Micro App SaaS Multitenant Ativo</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          E-commerce & CRM Multitenant
        </h1>
        <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto">
          Plataforma com isolamento multitenant, vitrines personalizadas com branding dinâmico,
          receptor de leads, carrinho inteligente e automação pós-venda.
        </p>

        {/* Escolha de Demonstração */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto pt-4">
          {Object.values(DEMO_TENANTS).map((tenant) => (
            <Link
              key={tenant.slug}
              href={`/${tenant.slug}`}
              className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-400 transition group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: tenant.branding?.primaryColor || '#2563eb' }}
                  >
                    <Store className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                    /{tenant.slug}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition">
                  {tenant.companyName}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Vitrine com paleta de cores customizada, receptor de leads e frete grátis &ge; R$ 150.
                </p>
              </div>

              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition">
                <span>Acessar Loja</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>

        <div className="pt-6 border-t border-slate-200 flex items-center justify-center gap-4">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-black transition shadow-sm"
          >
            <Shield className="w-4 h-4 text-blue-400" />
            <span>Acessar Painel Administrativo</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
