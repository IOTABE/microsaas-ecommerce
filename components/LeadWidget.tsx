'use client';

import React, { useState } from 'react';
import { Sparkles, MessageCircle, CheckCircle, AlertCircle, Send, Calendar } from 'lucide-react';

interface LeadWidgetProps {
  tenantSlug: string;
}

export function LeadWidget({ tenantSlug }: LeadWidgetProps) {
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [consentLgpd, setConsentLgpd] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanPhone = whatsapp.replace(/\D/g, '');
    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
      setError('Por favor, informe um WhatsApp válido com DDD.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantSlug,
          name,
          whatsapp: cleanPhone,
          birthDate: birthDate || undefined,
          consentLgpd,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao registrar contato');
      }

      setSuccess(true);
      setName('');
      setWhatsapp('');
      setBirthDate('');
    } catch (err: any) {
      setError(err.message || 'Falha na conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="my-8 max-w-xl mx-auto">
      <div className="glass-card-tonal p-7 shadow-glass relative overflow-hidden transition-all duration-300 hover:shadow-glass-hover">
        {/* Decoração sutil de luz do Glassmorphism */}
        <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-white/40 blur-2xl pointer-events-none" />

        <div className="flex items-center gap-3.5 mb-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
            style={{
              backgroundColor: 'var(--primary-container, rgba(219, 234, 254, 0.6))',
              color: 'var(--primary-color, #2563eb)',
            }}
          >
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Clube de Vantagens VIP
            </span>
            <h3 className="font-extrabold text-slate-900 text-lg tracking-tight">
              Receba Ofertas & Cupons Exclusivos
            </h3>
            <p className="text-xs text-slate-500">
              Cadastre seu WhatsApp e receba condições especiais direto na sua conversa.
            </p>
          </div>
        </div>

        {success ? (
          <div className="p-4 bg-emerald-50/80 backdrop-blur-md text-emerald-900 rounded-2xl flex items-center gap-3 border border-emerald-200/80 shadow-sm animate-fade-in">
            <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-600" />
            <p className="text-xs font-semibold">
              🎉 Perfeito! Seu número foi incluído na nossa lista VIP de promoções.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50/80 backdrop-blur-md text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-200">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 ml-1">
                  Seu Nome
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Mariana Lima"
                  className="w-full px-3.5 py-2.5 text-xs glass-input focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 ml-1">
                  WhatsApp (com DDD)
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="(11) 98765-4321"
                    className="w-full px-3.5 py-2.5 text-xs glass-input focus:outline-none pl-9"
                  />
                  <MessageCircle className="w-4 h-4 text-emerald-500 absolute left-3 top-3" />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 ml-1">
                  Data de Nascimento <span className="text-slate-400 font-normal">(opcional)</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-3.5 py-2.5 text-xs glass-input focus:outline-none pl-9"
                  />
                  <Calendar className="w-4 h-4 text-blue-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 ml-1">
              <input
                type="checkbox"
                id="lgpd_consent"
                checked={consentLgpd}
                onChange={(e) => setConsentLgpd(e.target.checked)}
                required
                className="w-4 h-4 rounded-md text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <label htmlFor="lgpd_consent" className="text-[11px] text-slate-500 cursor-pointer">
                Concordo em receber alertas de promoções no WhatsApp de acordo com a LGPD.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-5 m3-button text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              style={{ backgroundColor: 'var(--primary-color, #2563eb)' }}
            >
              <Send className="w-3.5 h-3.5" />
              <span>{loading ? 'Cadastrando...' : 'Quero Receber Ofertas no WhatsApp'}</span>
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
