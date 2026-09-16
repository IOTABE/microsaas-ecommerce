import React from 'react';
import {
  Users,
  ShoppingCart,
  Gift,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  PackageCheck
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Visão Geral do Negócio</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Acompanhe o desempenho de vendas, pós-venda, pedidos de presentes e captação de leads.
        </p>
      </div>

      {/* Cards de Métricas Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500">Vendas Totais</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">R$ 4.820,00</div>
          <div className="text-[11px] text-emerald-600 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3 h-3" /> +18.4% este mês
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500">Leads Capturados (Home)</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">142 contatos</div>
          <div className="text-[11px] text-purple-600 font-semibold">Nome + WhatsApp coletados</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500">Pedidos para Presente</span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
              <Gift className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">28 pedidos</div>
          <div className="text-[11px] text-rose-600 font-semibold">Com cartão e embalagem</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500">Frete Grátis (&ge; R$ 150)</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">64% dos pedidos</div>
          <div className="text-[11px] text-blue-600 font-semibold">Ticket médio elevado</div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Esteira de Expedição & Pós-Venda</h3>
          <p className="text-xs text-slate-500">
            Consulte os pedidos recentes, verifique quais são para presente e atualize o código de
            rastreio para o cliente.
          </p>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            <span>Gerenciar Pedidos & Pós-Vendas</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Disparo de Ofertas por E-mail & WhatsApp</h3>
          <p className="text-xs text-slate-500">
            Envie mensagens promocionais e cupons diretamente para a lista de leads da home e
            clientes cadastrados.
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
