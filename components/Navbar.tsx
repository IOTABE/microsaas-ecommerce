'use client';

import React from 'react';
import { ShoppingBag, Store, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { TenantData } from '@/lib/types';

interface NavbarProps {
  tenant: TenantData;
  cartCount: number;
  onOpenCart: () => void;
}

export function Navbar({ tenant, cartCount, onOpenCart }: NavbarProps) {
  return (
    <header className="sticky top-3 z-40 px-4 max-w-6xl mx-auto w-full transition-all">
      <div className="glass-pill px-5 h-16 flex items-center justify-between shadow-glass">
        {/* Logo / Nome do Tenant (Material You Shape) */}
        <Link href={`/${tenant.slug}`} className="flex items-center gap-3 group">
          {tenant.branding?.logoUrl ? (
            <img
              src={tenant.branding.logoUrl}
              alt={tenant.companyName}
              className="w-10 h-10 object-cover rounded-2xl shadow-sm border border-white/80 group-hover:scale-105 transition duration-200"
            />
          ) : (
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:scale-105 transition duration-200"
              style={{ backgroundColor: 'var(--primary-color, #2563eb)' }}
            >
              <Store className="w-5 h-5" />
            </div>
          )}
          <div>
            <span className="font-bold text-slate-900 text-sm sm:text-base block leading-tight tracking-tight">
              {tenant.companyName}
            </span>
            <span className="text-[10px] text-slate-400 font-mono tracking-wider">
              {tenant.slug}.meusaas.com
            </span>
          </div>
        </Link>

        {/* Ações da Barra */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3.5 py-2 rounded-full border border-slate-200/60 bg-white/50 hover:bg-white/90 backdrop-blur-md transition hidden sm:flex items-center gap-1.5 shadow-sm"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Painel Lojista</span>
          </Link>

          {/* Botão Carrinho / Sacola em formato de Pílula Material You */}
          <button
            onClick={onOpenCart}
            className="relative m3-button px-4 py-2 bg-slate-900 text-white hover:bg-black flex items-center gap-2.5 shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-xs font-semibold hidden sm:inline">Sacola</span>
            {cartCount > 0 && (
              <span className="w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
