import React from 'react';
import {
  Users,
  ShoppingCart,
  Gift,
  DollarSign,
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Visão Geral do Negócio
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Acompanhe métricas em tempo real com estética Material You e transparências translúcidas.
        </p>
      </div>

      {/* Cards de Métricas em Glassmorphism */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 shadow-glass space-y-2 hover:-translate-y-0.5 transition duration-200">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-500">Vendas Totais</span>
            <div className="w-9 h-9 bg-emerald-100/80 text-emerald-700 rounded-2xl flex items-center justify-center shadow-sm">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">R$ 4.820,00</div>
          <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18.4% este mês
          </div>
        </div>

        <div className="glass-card p-5 shadow-glass space-y-2 hover:-translate-y-0.5 transition duration-200">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-500">Leads (Home)</span>
            <div className="w-9 h-9 bg-purple-100/80 text-purple-700 rounded-2xl flex items-center justify-center shadow-sm">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">142 contatos</div>
          <div className="text-[11px] text-purple-700 font-bold">Capturados na vitrine</div>
        </div>

        <div className="glass-card p-5 shadow-glass space-y-2 hover:-translate-y-0.5 transition duration-200">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-500">Pedidos para Presente</span>
            <div className="w-9 h-9 bg-rose-100/80 text-rose-700 rounded-2xl flex items-center justify-center shadow-sm">
              <Gift className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">28 pedidos</div>
          <div className="text-[11px] text-rose-700 font-bold">Com cartão e embalagem</div>
        </div>

        <div className="glass-card p-5 shadow-glass space-y-2 hover:-translate-y-0.5 transition duration-200">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-500">Frete Grátis (&ge; R$ 150)</span>
            <div className="w-9 h-9 bg-blue-100/80 text-blue-700 rounded-2xl flex items-center justify-center shadow-sm">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">64% dos pedidos</div>
          <div className="text-[11px] text-blue-700 font-bold">Ticket médio elevado</div>
        </div>
      </div>

      {/* Ações Rápidas em Glassmorphic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
        <div className="glass-card p-6 shadow-glass space-y-3">
          <h3 className="font-extrabold text-slate-900 text-base">Esteira de Expedição & Pós-Venda</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Consulte os pedidos recentes, verifique quais são para presente e atualize o código de
            rastreamento para o cliente.
          </p>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            <span>Gerenciar Pedidos & Pós-Vendas</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="glass-card p-6 shadow-glass space-y-3">
          <h3 className="font-extrabold text-slate-900 text-base">Disparo de Ofertas Omnichannel</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Envie mensagens promocionais e cupons diretamente para a lista de leads da home e
            clientes cadastrados via E-mail e WhatsApp.
          </p>
          <Link
            href="/admin/campaigns"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-700"
          >
            <span>Criar Nova Campanha de Alerta</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
