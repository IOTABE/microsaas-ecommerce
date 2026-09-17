import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Palette,
  Package,
  ShoppingCart,
  Users,
  Send,
  Store,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100/90 relative overflow-hidden flex">
      {/* Esferas de Fundo para Glassmorphism no Admin */}
      <div className="absolute top-0 right-10 w-96 h-96 rounded-full blur-3xl opacity-15 bg-blue-400 pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full blur-3xl opacity-10 bg-purple-400 pointer-events-none" />

      {/* Sidebar Dark Glass */}
      <aside className="w-64 glass-dark text-white flex flex-col justify-between hidden md:flex relative z-20">
        <div>
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-extrabold text-sm shadow-sm">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-sm tracking-wide block">Micro SaaS</span>
                <span className="text-[10px] text-slate-400 font-mono">Painel Lojista</span>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-1.5 text-xs">
            <Link
              href="/admin"
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-full text-slate-300 hover:bg-white/10 hover:text-white transition"
            >
              <LayoutDashboard className="w-4 h-4 text-blue-400" />
              <span className="font-medium">Visão Geral</span>
            </Link>

            <Link
              href="/admin/branding"
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-full text-slate-300 hover:bg-white/10 hover:text-white transition"
            >
              <Palette className="w-4 h-4 text-pink-400" />
              <span className="font-medium">Cores, Logo & Senha</span>
            </Link>

            <Link
              href="/admin/products"
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-full text-slate-300 hover:bg-white/10 hover:text-white transition"
            >
              <Package className="w-4 h-4 text-amber-400" />
              <span className="font-medium">Cadastro de Produtos</span>
            </Link>

            <Link
              href="/admin/orders"
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-full text-slate-300 hover:bg-white/10 hover:text-white transition"
            >
              <ShoppingCart className="w-4 h-4 text-emerald-400" />
              <span className="font-medium">Vendas & Pós-Vendas</span>
            </Link>

            <Link
              href="/admin/customers"
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-full text-slate-300 hover:bg-white/10 hover:text-white transition"
            >
              <Users className="w-4 h-4 text-purple-400" />
              <span className="font-medium">Clientes & Leads</span>
            </Link>

            <Link
              href="/admin/campaigns"
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-full text-slate-300 hover:bg-white/10 hover:text-white transition"
            >
              <Send className="w-4 h-4 text-sky-400" />
              <span className="font-medium">Alertas & Promoções</span>
            </Link>
          </nav>
        </div>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            href="/demo-loja"
            target="_blank"
            className="flex items-center justify-between text-xs text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 p-3 rounded-2xl border border-white/5 transition"
          >
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-emerald-400" />
              <span>Ver Vitrine da Loja</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto relative z-10">
        <header className="h-16 bg-white/70 backdrop-blur-xl border-b border-white/60 px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Tenant Ativo:</span>
            <span className="text-xs font-bold bg-blue-50/80 text-blue-700 px-3 py-1 rounded-full border border-blue-200 backdrop-blur-md">
              demo-loja (Boutique & Presentes)
            </span>
          </div>

          <Link
            href="/demo-loja"
            className="text-xs font-bold text-slate-700 hover:text-slate-900 border border-slate-200/80 bg-white/60 backdrop-blur-md px-3.5 py-1.5 rounded-full hover:bg-white transition flex items-center gap-1.5 shadow-sm"
          >
            <span>Acessar Vitrine</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </header>

        <main className="p-6 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
