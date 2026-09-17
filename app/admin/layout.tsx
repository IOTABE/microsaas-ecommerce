'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Send,
  Settings,
  Store,
  ExternalLink,
  ShoppingBag,
  Search,
  Bell,
  ChevronDown,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Produtos', icon: Package },
  { href: '/admin/orders', label: 'Pedidos', icon: ShoppingCart },
  { href: '/admin/customers', label: 'Clientes', icon: Users },
  { href: '/admin/campaigns', label: 'Campanhas', icon: Send },
  { href: '/admin/branding', label: 'Configurações', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="admin-shell min-h-screen flex text-slate-200">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 hidden md:flex flex-col justify-between border-r border-white/[0.06] bg-[#0a0f20]/80 backdrop-blur-xl">
        <div>
          {/* Logo */}
          <div className="px-5 h-16 flex items-center gap-2.5 border-b border-white/[0.06]">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-white">
              Lojista<span className="text-blue-400">Pro</span>
            </span>
          </div>

          <nav className="p-3 space-y-1">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const isActive =
                href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-700/30'
                      : 'text-slate-400 hover:bg-white/[0.05] hover:text-white'
                  }`}
                >
                  <Icon className="w-[18px] h-[18px]" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-3 border-t border-white/[0.06]">
          <Link
            href="/demo-loja"
            target="_blank"
            className="flex items-center justify-between text-xs text-slate-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] p-2.5 rounded-xl transition"
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
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-[#0a0f20]/70 backdrop-blur-xl border-b border-white/[0.06] px-6 flex items-center justify-between sticky top-0 z-20">
          <h1 className="text-base font-bold text-white tracking-tight">
            Painel do Administrador
          </h1>

          <div className="flex items-center gap-4">
            {/* Busca */}
            <div className="hidden lg:flex items-center gap-2 w-72 bg-white/[0.04] border border-white/[0.08] rounded-full px-4 py-2 focus-within:border-blue-500/60 focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.15)] transition">
              <Search className="w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Pesquisar pedidos..."
                className="bg-transparent border-none outline-none text-xs text-slate-200 placeholder:text-slate-500 w-full"
              />
            </div>

            {/* Notificações */}
            <button className="relative p-2 rounded-full hover:bg-white/[0.06] transition">
              <Bell className="w-5 h-5 text-slate-300" />
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#0a0f20]">
                12
              </span>
            </button>

            {/* Usuário */}
            <button className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-full hover:bg-white/[0.06] transition">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                TS
              </div>
              <span className="hidden sm:block text-xs font-semibold text-slate-200">
                Admin: Thiago S.
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
