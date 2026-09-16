'use client';

import React, { useState } from 'react';
import {
  ShoppingCart,
  Gift,
  Truck,
  CheckCircle,
  Clock,
  Send,
  MessageSquare,
  ChevronRight
} from 'lucide-react';

interface OrderMock {
  id: string;
  orderNumber: number;
  customerName: string;
  customerPhone: string;
  subtotal: number;
  shippingFee: number;
  total: number;
  isGift: boolean;
  giftMessage?: string;
  status: 'pending_payment' | 'paid' | 'in_preparation' | 'shipped' | 'delivered';
  trackingCode?: string;
  date: string;
}

const INITIAL_ORDERS: OrderMock[] = [
  {
    id: 'ord_1',
    orderNumber: 108422,
    customerName: 'Beatriz Vasconcelos',
    customerPhone: '(11) 99876-1122',
    subtotal: 159.80,
    shippingFee: 0.00, // Frete Grátis >= 150
    total: 159.80,
    isGift: true,
    giftMessage: 'Feliz aniversário tia Lúcia! Que seu dia seja tão doce quanto você.',
    status: 'in_preparation',
    trackingCode: '',
    date: 'Hoje às 10:45',
  },
  {
    id: 'ord_2',
    orderNumber: 108421,
    customerName: 'Rodrigo Mendonça',
    customerPhone: '(21) 98765-4321',
    subtotal: 89.90,
    shippingFee: 15.00, // Taxa de entrega < 150
    total: 104.90,
    isGift: false,
    status: 'shipped',
    trackingCode: 'BR123456789XP',
    date: 'Hoje às 09:12',
  },
  {
    id: 'ord_3',
    orderNumber: 108420,
    customerName: 'Camila Fernandes',
    customerPhone: '(31) 97654-3210',
    subtotal: 190.00,
    shippingFee: 0.00,
    total: 190.00,
    isGift: true,
    giftMessage: 'Com muito carinho para o nosso novo lar!',
    status: 'delivered',
    trackingCode: 'BR987654321XP',
    date: 'Ontem às 16:30',
  },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderMock[]>(INITIAL_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<OrderMock | null>(INITIAL_ORDERS[0]);
  const [trackingInput, setTrackingInput] = useState('');

  const handleUpdateStatus = (
    orderId: string,
    newStatus: OrderMock['status'],
    tracking?: string
  ) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: newStatus,
              trackingCode: tracking !== undefined ? tracking : o.trackingCode,
            }
          : o
      )
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({
        ...selectedOrder,
        status: newStatus,
        trackingCode: tracking !== undefined ? tracking : selectedOrder.trackingCode,
      });
    }
  };

  const getStatusBadge = (status: OrderMock['status']) => {
    switch (status) {
      case 'pending_payment':
        return (
          <span className="bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1">
            <Clock className="w-3 h-3" /> Aguardando Pagamento
          </span>
        );
      case 'paid':
        return (
          <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Pagamento Aprovado
          </span>
        );
      case 'in_preparation':
        return (
          <span className="bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1">
            <Clock className="w-3 h-3" /> Em Separação
          </span>
        );
      case 'shipped':
        return (
          <span className="bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1">
            <Truck className="w-3 h-3" /> Despachado
          </span>
        );
      case 'delivered':
        return (
          <span className="bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-emerald-600" /> Entregue
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Vendas & Pós-Vendas</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Acompanhe os pedidos, identifique solicitações de presente e gerencie a esteira de entrega.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna 1 & 2: Lista de Pedidos */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-900 text-sm">Pedidos Recentes</h2>
            <span className="text-xs text-slate-400 font-mono">{orders.length} pedidos</span>
          </div>

          <div className="divide-y divide-slate-100">
            {orders.map((order) => (
              <div
                key={order.id}
                onClick={() => {
                  setSelectedOrder(order);
                  setTrackingInput(order.trackingCode || '');
                }}
                className={`p-4 hover:bg-slate-50 cursor-pointer transition flex items-center justify-between ${
                  selectedOrder?.id === order.id ? 'bg-blue-50/40 border-l-4 border-blue-600' : ''
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-slate-900">
                      #{order.orderNumber}
                    </span>
                    {getStatusBadge(order.status)}
                    {order.isGift && (
                      <span className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1 border border-rose-200">
                        <Gift className="w-3 h-3 text-rose-600" /> Presente
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600">
                    <strong>{order.customerName}</strong> • {order.customerPhone}
                  </p>
                  <span className="text-[10px] text-slate-400">{order.date}</span>
                </div>

                <div className="text-right space-y-1">
                  <div className="font-bold text-sm text-slate-900">
                    R$ {order.total.toFixed(2)}
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    {order.shippingFee === 0 ? 'Frete Grátis' : `Frete R$ ${order.shippingFee.toFixed(2)}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coluna 3: Detalhes do Pós-Vendas & Expedição */}
        {selectedOrder && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-400">
                  PEDIDO #{selectedOrder.orderNumber}
                </span>
                {getStatusBadge(selectedOrder.status)}
              </div>
              <h3 className="font-bold text-slate-900 text-base mt-1">
                {selectedOrder.customerName}
              </h3>
              <p className="text-xs text-slate-500">{selectedOrder.customerPhone}</p>
            </div>

            {/* Alerta de Presente & Dedicatória */}
            {selectedOrder.isGift ? (
              <div className="bg-rose-50 p-4 rounded-xl border border-rose-200 space-y-2">
                <div className="flex items-center gap-2 text-rose-900 font-bold text-xs">
                  <Gift className="w-4 h-4 text-rose-600" />
                  <span>EMBALAGEM DE PRESENTE EXIGIDA</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-rose-200 text-xs text-rose-800">
                  <span className="font-semibold block text-[10px] text-rose-500 uppercase tracking-wider mb-1">
                    Cartão Dedicatória:
                  </span>
                  &ldquo;{selectedOrder.giftMessage || 'Sem mensagem no cartão'}&rdquo;
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 p-3 rounded-xl text-xs text-slate-500">
                Pedido regular (embalagem padrão de envio).
              </div>
            )}

            {/* Atualização de Etapa do Pós-Venda */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                Avançar Esteira de Pós-Venda
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'in_preparation')}
                  className="p-2 border border-slate-200 rounded-lg text-xs hover:bg-slate-50 font-medium"
                >
                  Em Separação
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'shipped')}
                  className="p-2 border border-slate-200 rounded-lg text-xs hover:bg-purple-50 text-purple-700 font-medium"
                >
                  Despachado
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'delivered')}
                  className="p-2 col-span-2 border border-emerald-200 bg-emerald-50 rounded-lg text-xs hover:bg-emerald-100 text-emerald-800 font-bold"
                >
                  Confirmar Entrega ao Cliente
                </button>
              </div>
            </div>

            {/* Código de Rastreio */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-700">
                Código de Rastreamento (Correios / Loggi)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  placeholder="EX: BR987654321XP"
                  className="w-full text-xs p-2 border border-slate-200 rounded-lg"
                />
                <button
                  onClick={() =>
                    handleUpdateStatus(selectedOrder.id, 'shipped', trackingInput)
                  }
                  className="px-3 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-black"
                >
                  Salvar
                </button>
              </div>
            </div>

            {/* Disparo de Pós-Venda / Pesquisa NPS */}
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() =>
                  alert(
                    `Disparo de pesquisa de satisfação NPS enviado via WhatsApp para ${selectedOrder.customerPhone}!`
                  )
                }
                className="w-full py-2.5 px-3 bg-purple-50 text-purple-700 border border-purple-200 rounded-xl text-xs font-semibold hover:bg-purple-100 transition flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Enviar Pesquisa de Satisfação (NPS)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
