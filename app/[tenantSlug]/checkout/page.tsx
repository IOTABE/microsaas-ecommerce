'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getTenantBySlug } from '@/lib/tenant';
import { calculateShipping } from '@/lib/shipping';
import { CartItem } from '@/lib/types';
import {
  ShieldCheck,
  Truck,
  Gift,
  QrCode,
  CreditCard,
  CheckCircle2,
  ArrowLeft,
  Copy,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const tenantSlug = typeof params.tenantSlug === 'string' ? params.tenantSlug : 'demo-loja';
  const tenant = getTenantBySlug(tenantSlug);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isGift, setIsGift] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card'>('pix');

  // Dados Completos do Cliente
  const [fullName, setFullName] = useState('');
  const [documentCpfCnpj, setDocumentCpfCnpj] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Endereço
  const [zipCode, setZipCode] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('SP');

  // Estados de Submissão e Pagamento
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderCreated, setOrderCreated] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`cart_${tenantSlug}`);
    if (saved) {
      try {
        setCartItems(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, [tenantSlug]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = calculateShipping(subtotal, tenant.branding?.deliveryFeeBelowThreshold);

  const handleCepBlur = async () => {
    const cleanCep = zipCode.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      try {
        const res = await fetch(`https://brasilapi.com.br/api/cep/v1/${cleanCep}`);
        if (res.ok) {
          const data = await res.json();
          setStreet(data.street || '');
          setNeighborhood(data.neighborhood || '');
          setCity(data.city || '');
          setState(data.state || 'SP');
        }
      } catch (e) {
        console.warn('Falha na busca de CEP', e);
      }
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (cartItems.length === 0) {
      setError('Seu carrinho está vazio!');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantSlug,
          customer: {
            fullName,
            documentCpfCnpj,
            email,
            phone,
            address: {
              zipCode,
              street,
              number,
              complement,
              neighborhood,
              city,
              state,
            },
          },
          items: cartItems,
          isGift,
          giftMessage: isGift ? giftMessage : undefined,
          paymentMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao processar o pedido');
      }

      setOrderCreated(data);
      localStorage.removeItem(`cart_${tenantSlug}`);
    } catch (err: any) {
      setError(err.message || 'Erro inesperado no checkout');
    } finally {
      setLoading(false);
    }
  };

  const copyPixCode = () => {
    if (orderCreated?.payment?.pixCopyPaste) {
      navigator.clipboard.writeText(orderCreated.payment.pixCopyPaste);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Tela de Sucesso com Pagamento
  if (orderCreated) {
    return (
      <div className="min-h-screen bg-slate-50 relative overflow-hidden flex items-center justify-center p-4">
        <div className="absolute top-10 left-10 w-96 h-96 rounded-full blur-3xl opacity-20 bg-emerald-400 pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full blur-3xl opacity-20 bg-blue-400 pointer-events-none" />

        <div className="max-w-lg w-full glass-card p-8 sm:p-10 shadow-glass text-center space-y-6 relative z-10">
          <div className="w-16 h-16 bg-emerald-100/80 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div>
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest">
              PEDIDO #{orderCreated.order.orderNumber}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 tracking-tight">
              Pedido Registrado!
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Obrigado, {fullName}. Seu pedido já foi inserido em nossa esteira de expedição.
            </p>
          </div>

          {/* Destaque de Presente */}
          {isGift && (
            <div className="bg-rose-50/80 backdrop-blur-md border border-rose-200/80 p-4 rounded-3xl text-left flex items-start gap-3 shadow-sm">
              <Gift className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-rose-950 space-y-1">
                <strong className="block font-bold">Embalagem de Presente Inclusa!</strong>
                {giftMessage ? (
                  <p className="italic bg-white/80 p-2.5 rounded-xl border border-rose-100 text-rose-800">
                    &ldquo;{giftMessage}&rdquo;
                  </p>
                ) : (
                  <p className="text-slate-500">Sem mensagem no cartão.</p>
                )}
              </div>
            </div>
          )}

          {/* Pagamento PIX */}
          {paymentMethod === 'pix' && (
            <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white/80 space-y-4 shadow-sm">
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-800">
                <QrCode className="w-4 h-4 text-emerald-600" />
                <span>Pague com PIX para confirmação instantânea</span>
              </div>

              {orderCreated.payment?.pixQrCode && (
                <div className="flex justify-center py-1">
                  <img
                    src={orderCreated.payment.pixQrCode}
                    alt="QR Code PIX"
                    className="w-48 h-48 border border-white rounded-2xl bg-white p-2 shadow-sm"
                  />
                </div>
              )}

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={copyPixCode}
                  className="w-full py-3 px-4 m3-button bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <Copy className="w-4 h-4" />
                  <span>{copied ? 'Código PIX Copiado!' : 'Copiar Código Copia e Cola'}</span>
                </button>
                <p className="text-[11px] text-slate-400">
                  Total a pagar:{' '}
                  <strong className="text-slate-800">R$ {shipping.total.toFixed(2)}</strong>
                </p>
              </div>
            </div>
          )}

          <div className="pt-2">
            <Link
              href={`/${tenantSlug}`}
              className="text-xs text-slate-500 hover:text-slate-900 font-semibold inline-flex items-center gap-1.5 transition"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar para a loja
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/80 py-10 px-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20 bg-blue-300 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-15 bg-rose-300 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Topo Flutuante */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href={`/${tenantSlug}`}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-white/60 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar para {tenant.companyName}
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-bold bg-emerald-50/80 px-3.5 py-1.5 rounded-full border border-emerald-200/80 backdrop-blur-md shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Checkout Seguro
          </div>
        </div>

        <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Formulário Principal */}
          <div className="md:col-span-2 space-y-6">
            {error && (
              <div className="p-4 bg-red-50/90 backdrop-blur-md text-red-700 text-xs rounded-2xl flex items-center gap-2 border border-red-200">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* 1. Dados Pessoais Completos */}
            <div className="glass-card p-6 shadow-glass space-y-4">
              <h2 className="font-extrabold text-slate-900 text-sm tracking-tight flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">
                  1
                </span>
                Dados Pessoais
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1 ml-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ex: Carlos Eduardo Silveira"
                    className="w-full text-xs p-3 glass-input focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 ml-1">
                    CPF ou CNPJ *
                  </label>
                  <input
                    type="text"
                    required
                    value={documentCpfCnpj}
                    onChange={(e) => setDocumentCpfCnpj(e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full text-xs p-3 glass-input focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 ml-1">
                    Celular / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 98765-4321"
                    className="w-full text-xs p-3 glass-input focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1 ml-1">
                    E-mail para confirmação *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="carlos@exemplo.com"
                    className="w-full text-xs p-3 glass-input focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 2. Endereço de Entrega */}
            <div className="glass-card p-6 shadow-glass space-y-4">
              <h2 className="font-extrabold text-slate-900 text-sm tracking-tight flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">
                  2
                </span>
                Endereço de Entrega
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 ml-1">CEP *</label>
                  <input
                    type="text"
                    required
                    value={zipCode}
                    onBlur={handleCepBlur}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="00000-000"
                    className="w-full text-xs p-3 glass-input focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1 ml-1">
                    Rua / Logradouro *
                  </label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Av. Paulista"
                    className="w-full text-xs p-3 glass-input focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 ml-1">Número *</label>
                  <input
                    type="text"
                    required
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="1000"
                    className="w-full text-xs p-3 glass-input focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 ml-1">Complemento</label>
                  <input
                    type="text"
                    value={complement}
                    onChange={(e) => setComplement(e.target.value)}
                    placeholder="Apto 42"
                    className="w-full text-xs p-3 glass-input focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 ml-1">Bairro *</label>
                  <input
                    type="text"
                    required
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    placeholder="Bela Vista"
                    className="w-full text-xs p-3 glass-input focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1 ml-1">Cidade *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="São Paulo"
                    className="w-full text-xs p-3 glass-input focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 ml-1">UF *</label>
                  <input
                    type="text"
                    required
                    value={state}
                    maxLength={2}
                    onChange={(e) => setState(e.target.value.toUpperCase())}
                    placeholder="SP"
                    className="w-full text-xs p-3 glass-input focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 3. Opção de Presente com Glassmorphism Rose */}
            <div className="bg-rose-50/70 backdrop-blur-xl p-6 rounded-3xl border border-rose-200/80 shadow-glass space-y-3">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isGift}
                  onChange={(e) => setIsGift(e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500 border-rose-300"
                />
                <div className="flex items-center gap-1.5 font-bold text-rose-950 text-sm">
                  <Gift className="w-4 h-4 text-rose-600" />
                  <span>Este pedido é um presente?</span>
                </div>
              </label>

              {isGift && (
                <div className="pt-2">
                  <label className="block text-xs font-medium text-rose-900 mb-1">
                    Dedicatória personalizada para o cartão:
                  </label>
                  <textarea
                    rows={3}
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value.slice(0, 250))}
                    placeholder="Escreva a mensagem que será impressa no cartão especial..."
                    className="w-full p-3 text-xs bg-white/90 rounded-2xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 shadow-inner"
                  />
                  <span className="text-[10px] text-rose-700 block text-right mt-1">
                    {250 - giftMessage.length} caracteres restantes
                  </span>
                </div>
              )}
            </div>

            {/* 4. Forma de Pagamento Material You Selection Chips */}
            <div className="glass-card p-6 shadow-glass space-y-4">
              <h2 className="font-extrabold text-slate-900 text-sm tracking-tight flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">
                  3
                </span>
                Forma de Pagamento
              </h2>
              <div className="grid grid-cols-2 gap-3.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pix')}
                  className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col items-center gap-2 ${
                    paymentMethod === 'pix'
                      ? 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-bold shadow-sm'
                      : 'border-slate-200/80 bg-white/50 text-slate-600 hover:bg-white'
                  }`}
                >
                  <QrCode className="w-6 h-6 text-emerald-600" />
                  <span className="text-xs">PIX (Aprovação Imediata)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('credit_card')}
                  className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col items-center gap-2 ${
                    paymentMethod === 'credit_card'
                      ? 'border-blue-500 bg-blue-50/80 text-blue-950 font-bold shadow-sm'
                      : 'border-slate-200/80 bg-white/50 text-slate-600 hover:bg-white'
                  }`}
                >
                  <CreditCard className="w-6 h-6 text-blue-600" />
                  <span className="text-xs">Cartão de Crédito</span>
                </button>
              </div>
            </div>
          </div>

          {/* Coluna Lateral: Resumo do Pedido */}
          <div className="space-y-4">
            <div className="glass-card p-6 shadow-glass space-y-4 sticky top-6">
              <h3 className="font-black text-slate-900 text-sm tracking-tight">Resumo da Compra</h3>

              <div className="divide-y divide-slate-100/80 max-h-60 overflow-y-auto space-y-2.5">
                {cartItems.map((item) => (
                  <div key={item.productId} className="pt-2.5 flex justify-between text-xs">
                    <span className="text-slate-600 truncate max-w-[160px]">
                      {item.quantity}x {item.title}
                    </span>
                    <span className="font-bold text-slate-900">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Regra de Frete dos R$ 150 */}
              <div className="pt-3 border-t border-slate-100/80 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>R$ {shipping.subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center text-slate-600">
                  <div className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-slate-400" />
                    <span>Frete</span>
                  </div>
                  {shipping.isFreeShipping ? (
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      GRÁTIS (&ge; R$ 150)
                    </span>
                  ) : (
                    <span className="font-semibold text-slate-800">
                      R$ {shipping.shippingFee.toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200/60">
                  <span>Total</span>
                  <span>R$ {shipping.total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || cartItems.length === 0}
                className="w-full py-3.5 px-4 m3-button bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                {loading ? 'Processando Pedido...' : 'Concluir & Pagar'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
