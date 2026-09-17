import React from 'react';
import {
  Wallet,
  MessageSquare,
  Percent,
  CalendarClock,
  MoreHorizontal,
  Eye,
  Trash2,
  TrendingUp,
} from 'lucide-react';

const KPIS = [
  {
    label: 'Vendas Hoje',
    value: 'R$ 14.350,90',
    delta: '+12,5% vs. ontem',
    icon: Wallet,
    accent: 'blue' as const,
  },
  {
    label: 'Leads Capturados',
    value: '328',
    delta: '+8,1% vs. ontem',
    icon: MessageSquare,
    accent: 'purple' as const,
  },
  {
    label: 'Taxa de Conversão',
    value: '4,1%',
    delta: '+0,5%',
    icon: Percent,
    accent: 'green' as const,
  },
  {
    label: 'Pedidos Pendentes',
    value: '114',
    delta: '21,1%',
    icon: CalendarClock,
    accent: 'orange' as const,
  },
];

const KPI_ACCENTS: Record<
  string,
  { card: string; icon: string; delta: string }
> = {
  blue: {
    card: 'from-blue-600/25 via-blue-500/5 to-transparent border-blue-400/30',
    icon: 'bg-blue-500 shadow-blue-500/50',
    delta: 'text-blue-300',
  },
  purple: {
    card: 'from-purple-600/25 via-purple-500/5 to-transparent border-purple-400/30',
    icon: 'bg-purple-500 shadow-purple-500/50',
    delta: 'text-purple-300',
  },
  green: {
    card: 'from-emerald-600/25 via-emerald-500/5 to-transparent border-emerald-400/30',
    icon: 'bg-emerald-500 shadow-emerald-500/50',
    delta: 'text-emerald-300',
  },
  orange: {
    card: 'from-orange-600/25 via-orange-500/5 to-transparent border-orange-400/30',
    icon: 'bg-orange-500 shadow-orange-500/50',
    delta: 'text-orange-300',
  },
};

const WEEKLY = [
  { day: 'Seg', sales: 11000, visitors: 6500 },
  { day: 'Ter', sales: 10000, visitors: 5000 },
  { day: 'Qua', sales: 15000, visitors: 8000 },
  { day: 'Qui', sales: 10000, visitors: 7500 },
  { day: 'Sex', sales: 14000, visitors: 10000 },
  { day: 'Sáb', sales: 17000, visitors: 9000 },
  { day: 'Dom', sales: 10000, visitors: 5500 },
];

const MAX = 20000;

type Payment = 'Pix' | 'CC';

interface KanbanCard {
  order: string;
  name: string;
  value: string;
  payment: Payment;
  date: string;
  status: string;
  statusColor: string;
}

interface KanbanColumn {
  title: string;
  count: number;
  accent: string;
  cards: KanbanCard[];
}

const KANBAN: KanbanColumn[] = [
  {
    title: 'Novo Pedido',
    count: 12,
    accent: 'bg-slate-400',
    cards: [
      { order: '#10431', name: 'Carlos S.', value: 'R$ 259,90', payment: 'Pix', date: '2023', status: 'Entregue', statusColor: 'text-emerald-400' },
      { order: '#10422', name: 'Carlos S.', value: 'R$ 259,90', payment: 'Pix', date: '2023', status: 'Entregue', statusColor: 'text-emerald-400' },
    ],
  },
  {
    title: 'Pagamento Confirmado',
    count: 24,
    accent: 'bg-emerald-400',
    cards: [
      { order: '#10430', name: 'Ana Paula R.', value: 'R$ 1.120,00', payment: 'CC', date: '2023', status: 'Entregue', statusColor: 'text-emerald-400' },
      { order: '#10429', name: 'Ana Paula R.', value: 'R$ 1.120,00', payment: 'CC', date: '2023', status: 'Entregue', statusColor: 'text-emerald-400' },
    ],
  },
  {
    title: 'Em Preparação',
    count: 18,
    accent: 'bg-blue-400',
    cards: [
      { order: '#10432', name: 'Carlos S.', value: 'R$ 1.120,00', payment: 'Pix', date: '2023', status: 'Entregue', statusColor: 'text-emerald-400' },
      { order: '#10428', name: 'Ana Paula R.', value: 'R$ 259,90', payment: 'CC', date: '2023', status: 'Entregue', statusColor: 'text-emerald-400' },
    ],
  },
  {
    title: 'Despachado',
    count: 31,
    accent: 'bg-purple-400',
    cards: [
      { order: '#10431', name: 'Carlos S.', value: 'R$ 259,90', payment: 'Pix', date: '2023', status: 'Entregue', statusColor: 'text-emerald-400' },
      { order: '#10429', name: 'Ana Paula R.', value: 'R$ 259,90', payment: 'Pix', date: '2023', status: 'Entregue', statusColor: 'text-emerald-400' },
    ],
  },
  {
    title: 'Entregue',
    count: 65,
    accent: 'bg-cyan-400',
    cards: [
      { order: '#10430', name: 'Ana Paula R.', value: 'R$ 1.120,00', payment: 'CC', date: '2023', status: 'Entregue', statusColor: 'text-emerald-400' },
      { order: '#10438', name: 'Ana Paula R.', value: 'R$ 1.120,00', payment: 'CC', date: '2023', status: 'Entregue', statusColor: 'text-emerald-400' },
    ],
  },
];

const Y_LABELS = ['R$ 20k', 'R$ 15k', 'R$ 10k', 'R$ 5k', 'R$ 0'];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6 max-w-6xl">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {KPIS.map(({ label, value, delta, icon: Icon, accent }) => {
          const a = KPI_ACCENTS[accent];
          return (
            <div
              key={label}
              className={`relative overflow-hidden rounded-2xl p-5 border bg-gradient-to-br backdrop-blur-xl ${a.card}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-300">{label}</p>
                  <p className="mt-1.5 text-2xl font-extrabold text-white tracking-tight">
                    {value}
                  </p>
                  <p className={`mt-1.5 text-[11px] font-semibold ${a.delta}`}>{delta}</p>
                </div>
                <div
                  className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-white shadow-lg ${a.icon}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desempenho Semanal */}
      <div className="panel p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-bold text-white">Desempenho Semanal</h2>
          <span className="text-xs text-slate-400">
            Visão Geral de Vendas – Outubro 2023
          </span>
        </div>

        <div className="flex items-center justify-center gap-6 mb-4 text-xs">
          <span className="flex items-center gap-2 text-slate-300">
            <span className="w-3 h-3 rounded-sm bg-gradient-to-t from-blue-600 to-cyan-400" />
            Vendas
          </span>
          <span className="flex items-center gap-2 text-slate-300">
            <span className="w-3 h-3 rounded-sm bg-gradient-to-t from-purple-700 to-fuchsia-500" />
            Visitantes
          </span>
        </div>

        <div className="relative h-64 pl-14">
          {/* Eixo Y */}
          <div className="absolute left-0 top-0 bottom-7 w-12 flex flex-col justify-between text-right pr-2 text-[10px] text-slate-500">
            {Y_LABELS.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </div>

          {/* Área do gráfico */}
          <div className="relative h-[calc(100%-1.75rem)] border-b border-white/10">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="absolute left-0 right-0 border-t border-white/[0.06]"
                style={{ top: `${i * 25}%` }}
              />
            ))}

            <div className="absolute inset-0 flex items-end justify-around px-2">
              {WEEKLY.map((d) => (
                <div
                  key={d.day}
                  className="flex items-end justify-center gap-2 h-full w-full max-w-[72px]"
                >
                  <div
                    className="w-4 sm:w-5 rounded-t-md bg-gradient-to-t from-blue-600 to-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.45)] transition-all"
                    style={{ height: `${(d.sales / MAX) * 100}%` }}
                    title={`Vendas: R$ ${d.sales.toLocaleString('pt-BR')}`}
                  />
                  <div
                    className="w-4 sm:w-5 rounded-t-md bg-gradient-to-t from-purple-700 to-fuchsia-500 shadow-[0_0_18px_rgba(217,70,239,0.4)] transition-all"
                    style={{ height: `${(d.visitors / MAX) * 100}%` }}
                    title={`Visitantes: ${d.visitors.toLocaleString('pt-BR')}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Eixo X */}
          <div className="flex justify-around px-2 mt-2 text-[11px] text-slate-400">
            {WEEKLY.map((d) => (
              <span key={d.day} className="w-full max-w-[72px] text-center">
                {d.day}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Pipeline de Pedidos - Kanban */}
      <div className="panel-solid p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-white">Pipeline de Pedidos – Kanban</h2>
          <button className="p-1.5 rounded-lg text-slate-400 hover:bg-white/[0.06] hover:text-white transition">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        <div className="admin-scroll overflow-x-auto pb-2">
          <div className="flex gap-4 min-w-max">
            {KANBAN.map((col) => (
              <div key={col.title} className="w-60 shrink-0">
                <div className="flex items-center gap-2 mb-3 px-1">
                  <span className={`w-2 h-2 rounded-full ${col.accent}`} />
                  <h3 className="text-xs font-bold text-slate-200 flex-1">{col.title}</h3>
                  <span className="text-[10px] font-bold text-slate-300 bg-white/[0.07] border border-white/10 rounded-full px-2 py-0.5">
                    {col.count}
                  </span>
                </div>

                <div className="space-y-3">
                  {col.cards.map((card) => (
                    <div
                      key={card.order}
                      className="panel p-3.5 hover:border-white/20 transition group"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-white">
                          {card.order} – {card.name}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            card.payment === 'Pix'
                              ? 'bg-cyan-500/15 text-cyan-300'
                              : 'bg-purple-500/15 text-purple-300'
                          }`}
                        >
                          {card.payment}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-slate-100">{card.value}</p>
                      <p className="text-[10px] text-slate-500 mt-1">
                        {card.payment === 'Pix' ? 'Pix' : 'CC'}
                      </p>
                      <p className="text-[10px] text-slate-500">Date: {card.date}</p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.06]">
                        <span className={`text-[10px] font-semibold ${card.statusColor}`}>
                          Status - {card.status}
                        </span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                          <button className="p-1 rounded text-slate-400 hover:text-cyan-300">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1 rounded text-slate-400 hover:text-red-400">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
        <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
        Dados de demonstração do painel do lojista.
      </p>
    </div>
  );
}
