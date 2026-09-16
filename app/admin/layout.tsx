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
  ExternalLink
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between hidden md:flex">
        <div>
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-sm">
                SaaS
              </div>
              <span className="font-bold text-sm tracking-wide">Painel Lojista</span>
            </div>
          </div>

          <nav className="p-4 space-y-1 text-xs">
            <Link
              href="/admin"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              <LayoutDashboard className="w-4 h-4 text-blue-400" />
              <span>Visão Geral</span>
            </Link>

            <Link
              href="/admin/branding"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              <Palette className="w-4 h-4 text-pink-400" />
              <span>Cores, Logo & Senha</span>
            </Link>

            <Link
              href="/admin/products"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              <Package className="w-4 h-4 text-amber-400" />
              <span>Cadastro de Produtos</span>
            </Link>

            <Link
              href="/admin/orders"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              <ShoppingCart className="w-4 h-4 text-emerald-400" />
              <span>Vendas & Pós-Vendas</span>
            </Link>

            <Link
              href="/admin/customers"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              <Users className="w-4 h-4 text-purple-400" />
              <span>Clientes & Leads</span>
            </Link>

            <Link
              href="/admin/campaigns"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              <Send className="w-4 h-4 text-sky-400" />
              <span>Alertas & Promoções</span>
            </Link>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            href="/demo-loja"
            target="_blank"
            className="flex items-center justify-between text-xs text-slate-400 hover:text-white bg-slate-800/60 p-2.5 rounded-xl transition"
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
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Tenant Ativo:</span>
            <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2 py-1 rounded-lg border border-blue-200">
              demo-loja (Boutique & Presentes)
            </span>
          </div>

          <Link
            href="/demo-loja"
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 flex items-center gap-1.5"
          >
            <span>Acessar Vitrine</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
