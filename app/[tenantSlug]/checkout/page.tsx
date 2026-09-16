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

  // Busca de CEP simplificada via BrasilAPI / ViaCEP
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
      // Limpa carrinho após pedido criado
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

  if (orderCreated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
              Pedido #{orderCreated.order.orderNumber}
            </span>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">Pedido Gerado com Sucesso!</h1>
            <p className="text-xs text-slate-500 mt-1">
              Obrigado, {fullName}. Seu pedido já foi registrado no sistema.
            </p>
          </div>

          {/* Destaque de Presente */}
          {isGift && (
            <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl text-left flex items-start gap-3">
              <Gift className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-rose-900 space-y-1">
                <strong className="block font-semibold">Embalagem de Presente Inclusa!</strong>
                {giftMessage ? (
                  <p className="italic bg-white/70 p-2 rounded border border-rose-100 text-rose-800">
                    &ldquo;{giftMessage}&rdquo;
                  </p>
                ) : (
                  <p>Sem mensagem no cartão.</p>
                )}
              </div>
            </div>
          )}

          {/* Área de Pagamento PIX */}
          {paymentMethod === 'pix' && (
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-800">
                <QrCode className="w-4 h-4 text-emerald-600" />
                <span>Pague com PIX para confirmação imediata</span>
              </div>

              {orderCreated.payment?.pixQrCode && (
                <div className="flex justify-center py-2">
                  <img
                    src={orderCreated.payment.pixQrCode}
                    alt="QR Code PIX"
                    className="w-48 h-48 border border-slate-200 rounded-xl bg-white p-2"
                  />
                </div>
              )}

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={copyPixCode}
                  className="w-full py-2.5 px-4 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <Copy className="w-4 h-4" />
                  <span>{copied ? 'Código PIX Copiado!' : 'Copiar Código Copia e Cola'}</span>
                </button>
                <p className="text-[11px] text-slate-400">
                  Total a pagar:{' '}
                  <strong className="text-slate-700">R$ {shipping.total.toFixed(2)}</strong>
                </p>
              </div>
            </div>
          )}

          <div className="pt-2">
            <Link
              href={`/${tenantSlug}`}
              className="text-xs text-slate-500 hover:text-slate-900 font-medium inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Voltar para a loja
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Topo */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href={`/${tenantSlug}`}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar para {tenant.companyName}
          </Link>
          <div className="flex items-center gap-1 text-xs text-emerald-700 font-medium bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <ShieldCheck className="w-4 h-4" /> Checkout Seguro
          </div>
        </div>

        <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Coluna 1 & 2: Dados do Cliente e Endereço */}
          <div className="md:col-span-2 space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-200">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* 1. Dados Pessoais Completos */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="font-bold text-slate-900 text-base">1. Dados Pessoais</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ex: João da Silva Santos"
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    CPF ou CNPJ *
                  </label>
                  <input
                    type="text"
                    required
                    value={documentCpfCnpj}
                    onChange={(e) => setDocumentCpfCnpj(e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Celular / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 98765-4321"
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    E-mail para confirmação *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 2. Endereço de Entrega */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="font-bold text-slate-900 text-base">2. Endereço de Entrega</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">CEP *</label>
                  <input
                    type="text"
                    required
                    value={zipCode}
                    onBlur={handleCepBlur}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="00000-000"
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Rua / Logradouro *</label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Av. Paulista"
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Número *</label>
                  <input
                    type="text"
                    required
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="1000"
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Complemento</label>
                  <input
                    type="text"
                    value={complement}
                    onChange={(e) => setComplement(e.target.value)}
                    placeholder="Apto 42"
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Bairro *</label>
                  <input
                    type="text"
                    required
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    placeholder="Bela Vista"
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Cidade *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="São Paulo"
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">UF *</label>
                  <input
                    type="text"
                    required
                    value={state}
                    maxLength={2}
                    onChange={(e) => setState(e.target.value.toUpperCase())}
                    placeholder="SP"
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 3. Opção de Presente */}
            <div className="bg-rose-50/70 p-5 rounded-2xl border border-rose-200 space-y-3">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isGift}
                  onChange={(e) => setIsGift(e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500"
                />
                <div className="flex items-center gap-1.5 font-bold text-rose-950 text-sm">
                  <Gift className="w-4 h-4 text-rose-600" />
                  <span>Este pedido é um presente?</span>
                </div>
              </label>

              {isGift && (
                <div className="pt-2">
                  <label className="block text-xs font-medium text-rose-900 mb-1">
                    Escreva a mensagem personalizada para acompanhar o presente:
                  </label>
                  <textarea
                    rows={3}
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value.slice(0, 250))}
                    placeholder="Deixe sua dedicatória que imprimiremos em um cartão especial..."
                    className="w-full p-2.5 text-xs bg-white rounded-lg border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                  <span className="text-[10px] text-rose-700 block text-right">
                    {250 - giftMessage.length} caracteres restantes
                  </span>
                </div>
              )}
            </div>

            {/* 4. Forma de Pagamento */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="font-bold text-slate-900 text-base">3. Forma de Pagamento</h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pix')}
                  className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition ${
                    paymentMethod === 'pix'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <QrCode className="w-6 h-6 text-emerald-600" />
                  <span className="text-xs">PIX (Imediato)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('credit_card')}
                  className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition ${
                    paymentMethod === 'credit_card'
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-6 h-6 text-blue-600" />
                  <span className="text-xs">Cartão de Crédito</span>
                </button>
              </div>
            </div>
          </div>

          {/* Coluna 3: Resumo do Pedido & Total */}
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 sticky top-6">
              <h3 className="font-bold text-slate-900 text-sm">Resumo da Compra</h3>

              <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto space-y-2">
                {cartItems.map((item) => (
                  <div key={item.productId} className="pt-2 flex justify-between text-xs">
                    <span className="text-slate-600 truncate max-w-[170px]">
                      {item.quantity}x {item.title}
                    </span>
                    <span className="font-semibold text-slate-900">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Cálculos de Frete */}
              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
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
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                      GRÁTIS (&ge; R$ 150)
                    </span>
                  ) : (
                    <span>R$ {shipping.shippingFee.toFixed(2)}</span>
                  )}
                </div>

                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total</span>
                  <span>R$ {shipping.total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || cartItems.length === 0}
                className="w-full py-3 px-4 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                {loading ? 'Processando Pedido...' : 'Pagar Agora'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
