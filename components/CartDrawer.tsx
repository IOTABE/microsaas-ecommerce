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
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-gray-700" />
              <h2 className="font-bold text-gray-900 text-lg">Seu Carrinho</h2>
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-semibold">
                {items.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Barra de Frete Grátis (< R$ 150) */}
          <div className="bg-amber-50/80 p-3.5 border-b border-amber-100">
            <div className="flex items-center gap-2 text-xs font-medium text-amber-900 mb-1.5">
              <Truck className="w-4 h-4 text-amber-600 flex-shrink-0" />
              {shipping.isFreeShipping ? (
                <span className="text-emerald-700 font-semibold">
                  🎉 Parabéns! Você ganhou Frete Grátis!
                </span>
              ) : (
                <span>
                  Faltam <strong>R$ {shipping.remainingForFreeShipping.toFixed(2)}</strong> para{' '}
                  <strong className="text-emerald-700">Frete Grátis</strong>
                </span>
              )}
            </div>
            <div className="w-full bg-amber-200/50 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  shipping.isFreeShipping ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Lista de Itens */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Seu carrinho está vazio</p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 items-center"
                >
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-500">
                      Foto
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">{item.title}</h4>
                    <p className="text-xs text-gray-500">R$ {item.price.toFixed(2)} cada</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                        <button
                          onClick={() => onUpdateQuantity(item.productId, -1)}
                          className="px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-100 rounded-l"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.productId, 1)}
                          className="px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-100 rounded-r"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.productId)}
                        className="text-gray-400 hover:text-red-500 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))
            )}

            {/* Opção "É para presente?" */}
            {items.length > 0 && (
              <div className="mt-4 p-4 rounded-xl border border-rose-200 bg-rose-50/50 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isGift}
                    onChange={(e) => setIsGift(e.target.checked)}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-gray-300"
                  />
                  <div className="flex items-center gap-1.5">
                    <Gift className="w-4 h-4 text-rose-600" />
                    <span className="text-sm font-semibold text-rose-900">
                      Este pedido é para presente?
                    </span>
                  </div>
                </label>
                <p className="text-xs text-rose-700 pl-6">
                  Embalamos com carinho especial e podemos incluir um cartão com a sua mensagem!
                </p>

                {isGift && (
                  <div className="pt-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Mensagem para o cartão (opcional - máx 250 caracteres):
                    </label>
                    <textarea
                      value={giftMessage}
                      onChange={(e) => setGiftMessage(e.target.value.slice(0, 250))}
                      placeholder="Ex: Parabéns pelo seu aniversário, com muito carinho da família!"
                      rows={2}
                      className="w-full text-xs p-2.5 rounded-lg border border-rose-200 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                    <span className="text-[10px] text-gray-400 block text-right">
                      {250 - giftMessage.length} caracteres restantes
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer & Totais */}
          {items.length > 0 && (
            <div className="p-4 border-t bg-gray-50 space-y-3">
              <div className="space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>R$ {shipping.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Taxa de Entrega:</span>
                  {shipping.isFreeShipping ? (
                    <span className="text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                      GRÁTIS
                    </span>
                  ) : (
                    <span>R$ {shipping.shippingFee.toFixed(2)}</span>
                  )}
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total:</span>
                  <span>R$ {shipping.total.toFixed(2)}</span>
                </div>
              </div>

              <Link
                href={`/${tenantSlug}/checkout`}
                onClick={onClose}
                className="w-full py-3 px-4 bg-emerald-600 text-white font-semibold text-sm rounded-xl hover:bg-emerald-700 transition flex items-center justify-center gap-2 shadow-sm"
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
