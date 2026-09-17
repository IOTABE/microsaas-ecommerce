'use client';

import React, { useState } from 'react';
import { X, Trash2, Gift, Truck, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem } from '@/lib/types';
import { calculateShipping, FREE_SHIPPING_THRESHOLD } from '@/lib/shipping';
import Link from 'next/link';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  tenantSlug: string;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  isGift: boolean;
  setIsGift: (val: boolean) => void;
  giftMessage: string;
  setGiftMessage: (val: string) => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  tenantSlug,
  onUpdateQuantity,
  onRemoveItem,
  isGift,
  setIsGift,
  giftMessage,
  setGiftMessage,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = calculateShipping(subtotal);
  const progressPercent = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/30 backdrop-blur-sm transition-all duration-300">
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white/85 backdrop-blur-2xl border-l border-white/60 shadow-2xl flex flex-col">
          {/* Header com Glassmorphism */}
          <div className="p-5 border-b border-slate-100/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-slate-100/80 flex items-center justify-center text-slate-800">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-extrabold text-slate-900 text-base tracking-tight">Sua Sacola</h2>
                <span className="text-[11px] text-slate-400">
                  {items.reduce((acc, i) => acc + i.quantity, 0)} itens adicionados
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Barra de Frete Grátis Material You (< R$ 150) */}
          <div className="bg-amber-50/60 backdrop-blur-md p-4 border-b border-amber-100/60">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-900 mb-2">
              <Truck className="w-4 h-4 text-amber-600 flex-shrink-0" />
              {shipping.isFreeShipping ? (
                <span className="text-emerald-700 font-bold">
                  🎉 Parabéns! Seu pedido tem Frete Grátis!
                </span>
              ) : (
                <span>
                  Adicione mais <strong>R$ {shipping.remainingForFreeShipping.toFixed(2)}</strong>{' '}
                  para ter <strong className="text-emerald-700">Frete Grátis</strong>
                </span>
              )}
            </div>
            <div className="w-full bg-amber-200/50 rounded-full h-2.5 overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  shipping.isFreeShipping ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Lista de Itens */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {items.length === 0 ? (
              <div className="text-center py-20 text-slate-400 space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-100/80 mx-auto flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 opacity-30" />
                </div>
                <p className="text-xs font-medium">Sua sacola de compras está vazia</p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-3.5 p-3.5 bg-white/70 backdrop-blur-md rounded-2xl border border-white/80 shadow-sm items-center transition hover:bg-white"
                >
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-xl shadow-inner border border-slate-100"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center text-[10px] text-slate-400">
                      Foto
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">R$ {item.price.toFixed(2)} cada</p>
                    <div className="flex items-center gap-2.5 mt-2">
                      <div className="flex items-center border border-slate-200/80 rounded-full bg-white/90 shadow-sm">
                        <button
                          onClick={() => onUpdateQuantity(item.productId, -1)}
                          className="px-2.5 py-0.5 text-xs text-slate-600 hover:text-slate-900"
                        >
                          -
                        </button>
                        <span className="px-1 text-xs font-bold">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.productId, 1)}
                          className="px-2.5 py-0.5 text-xs text-slate-600 hover:text-slate-900"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.productId)}
                        className="text-slate-400 hover:text-rose-500 p-1 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-black text-slate-900">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))
            )}

            {/* Opção Material You "É para presente?" com Glassmorphism Rose */}
            {items.length > 0 && (
              <div className="mt-4 p-4 rounded-3xl border border-rose-200/80 bg-rose-50/60 backdrop-blur-md space-y-2.5 shadow-sm">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isGift}
                    onChange={(e) => setIsGift(e.target.checked)}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-rose-300"
                  />
                  <div className="flex items-center gap-1.5 font-bold text-xs text-rose-950">
                    <Gift className="w-4 h-4 text-rose-600" />
                    <span>Este pedido é para presente?</span>
                  </div>
                </label>
                <p className="text-[11px] text-rose-700 pl-6 leading-relaxed">
                  Embalamos com laço especial e podemos incluir um cartão com a sua mensagem!
                </p>

                {isGift && (
                  <div className="pt-2">
                    <label className="block text-[11px] font-semibold text-rose-900 mb-1">
                      Mensagem no cartão (máx 250 caracteres):
                    </label>
                    <textarea
                      value={giftMessage}
                      onChange={(e) => setGiftMessage(e.target.value.slice(0, 250))}
                      placeholder="Ex: Feliz Aniversário! Com muito carinho da família..."
                      rows={2}
                      className="w-full text-xs p-3 rounded-2xl border border-rose-200 bg-white/90 focus:outline-none focus:ring-2 focus:ring-rose-400 shadow-inner"
                    />
                    <span className="text-[10px] text-rose-600/80 block text-right mt-1">
                      {250 - giftMessage.length} caracteres restantes
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer & Totais */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-100/80 bg-white/70 backdrop-blur-xl space-y-3.5">
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">R$ {shipping.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Entrega</span>
                  {shipping.isFreeShipping ? (
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      GRÁTIS
                    </span>
                  ) : (
                    <span className="font-semibold text-slate-800">R$ {shipping.shippingFee.toFixed(2)}</span>
                  )}
                </div>
                <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200/60">
                  <span>Total</span>
                  <span>R$ {shipping.total.toFixed(2)}</span>
                </div>
              </div>

              <Link
                href={`/${tenantSlug}/checkout`}
                onClick={onClose}
                className="w-full py-3.5 px-5 m3-button bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Finalizar Pedido</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
