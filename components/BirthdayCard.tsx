'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Cake,
  PartyPopper,
  MessageCircle,
  Mail,
  Gift,
  Copy,
  Check,
  RefreshCw,
  Loader2,
  Ticket,
} from 'lucide-react';
import type { BirthdayPerson } from '@/lib/types';

interface BirthdayCardProps {
  tenantSlug?: string;
  storeName?: string;
}

const DEFAULT_COUPON = 'ANIVER10';
const DEFAULT_DISCOUNT = '10%';

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

function onlyDigits(value: string) {
  return value.replace(/\D/g, '');
}

function whatsappLink(phone: string, message: string) {
  const digits = onlyDigits(phone);
  const full = digits.startsWith('55') ? digits : `55${digits}`;
  return `https://wa.me/${full}?text=${encodeURIComponent(message)}`;
}

function mailtoLink(email: string, message: string) {
  return `mailto:${email}?subject=${encodeURIComponent('🎉 Feliz Aniversário!')}&body=${encodeURIComponent(message)}`;
}

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  });
}

export function BirthdayCard({ tenantSlug = 'demo-loja', storeName = 'nossa loja' }: BirthdayCardProps) {
  const [birthdays, setBirthdays] = useState<BirthdayPerson[]>([]);
  const [date, setDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [coupon, setCoupon] = useState(DEFAULT_COUPON);
  const [discount, setDiscount] = useState(DEFAULT_DISCOUNT);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/birthdays?tenantSlug=${encodeURIComponent(tenantSlug)}`, {
        cache: 'no-store',
      });
      const text = await res.text();
      let data: { birthdays?: BirthdayPerson[]; date?: string; error?: string } = {};
      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          data = {};
        }
      }
      if (!res.ok) throw new Error(data.error || `Falha ao carregar aniversariantes (HTTP ${res.status})`);
      setBirthdays(data.birthdays ?? []);
      setDate(data.date ?? null);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar aniversariantes');
    } finally {
      setLoading(false);
    }
  }, [tenantSlug]);

  useEffect(() => {
    load();
  }, [load]);

  const buildMessage = useCallback(
    (person: BirthdayPerson) =>
      `Olá ${person.name}! 🎉 A equipe ${storeName} te deseja um feliz aniversário! ` +
      `Para comemorar, use o cupom ${coupon} e ganhe ${discount} de desconto na sua próxima compra. ` +
      `Válido por 7 dias! 🎁`,
    [storeName, coupon, discount]
  );

  const handleCopy = async (person: BirthdayPerson) => {
    const message = buildMessage(person);
    try {
      await navigator.clipboard.writeText(message);
      setCopiedId(person.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      /* clipboard indisponível */
    }
  };

  const countLabel = useMemo(
    () => (birthdays.length === 1 ? '1 aniversariante' : `${birthdays.length} aniversariantes`),
    [birthdays.length]
  );

  return (
    <section className="relative overflow-hidden rounded-2xl border border-pink-400/25 bg-gradient-to-br from-pink-600/20 via-fuchsia-600/5 to-transparent backdrop-blur-xl p-5">
      <div className="absolute -top-16 -right-10 w-48 h-48 rounded-full bg-pink-500/20 blur-3xl pointer-events-none" />

      <div className="relative flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-pink-600/30">
            <Cake className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              Aniversariantes de Hoje
              {!loading && !error && (
                <span className="text-[10px] font-bold text-pink-200 bg-pink-500/15 border border-pink-400/30 rounded-full px-2 py-0.5">
                  {countLabel}
                </span>
              )}
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {date ? formatDate(date) : 'Envie parabéns e um cupom especial'}
            </p>
          </div>
        </div>

        <button
          onClick={load}
          disabled={loading}
          title="Atualizar"
          className="p-2 rounded-lg text-slate-400 hover:bg-white/[0.06] hover:text-white transition disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
        </button>
      </div>

      {/* Configuração da promoção */}
      <div className="relative mt-4 grid grid-cols-2 gap-3 max-w-md">
        <div>
          <label className="field-label flex items-center gap-1.5">
            <Ticket className="w-3.5 h-3.5 text-pink-300" />
            Cupom de aniversário
          </label>
          <input
            type="text"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value.toUpperCase())}
            placeholder="ANIVER10"
            className="input-dark"
          />
        </div>
        <div>
          <label className="field-label flex items-center gap-1.5">
            <Gift className="w-3.5 h-3.5 text-pink-300" />
            Desconto
          </label>
          <input
            type="text"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            placeholder="10%"
            className="input-dark"
          />
        </div>
      </div>

      {/* Conteúdo */}
      <div className="relative mt-4">
        {loading ? (
          <div className="space-y-2">
            {[0, 1].map((i) => (
              <div key={i} className="h-14 rounded-xl bg-white/[0.04] animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="p-3 text-xs rounded-xl flex items-center gap-2 border bg-red-500/10 text-red-300 border-red-400/25">
            <span>{error}</span>
          </div>
        ) : birthdays.length === 0 ? (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-slate-400">
            <PartyPopper className="w-5 h-5 text-slate-500" />
            <p className="text-xs">Nenhum cliente ou lead faz aniversário hoje. Volte amanhã! 🎂</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {birthdays.map((person) => (
              <li
                key={person.id}
                className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-pink-400/30 transition flex-wrap"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-fuchsia-600 flex items-center justify-center text-[11px] font-bold text-white shrink-0">
                    {initials(person.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate flex items-center gap-2">
                      {person.name}
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          person.type === 'customer'
                            ? 'bg-purple-500/15 text-purple-300'
                            : 'bg-blue-500/15 text-blue-300'
                        }`}
                      >
                        {person.type === 'customer' ? 'Cliente' : 'Lead'}
                      </span>
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Faz <span className="text-pink-300 font-semibold">{person.age} anos</span> hoje ·{' '}
                      {person.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopy(person)}
                    title="Copiar mensagem"
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition"
                  >
                    {copiedId === person.id ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  {person.email && (
                    <a
                      href={mailtoLink(person.email, buildMessage(person))}
                      title="Enviar por e-mail"
                      className="p-2 rounded-lg text-slate-400 hover:text-sky-300 hover:bg-sky-500/10 transition"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  )}

                  <a
                    href={whatsappLink(person.phone, buildMessage(person))}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/15 text-emerald-300 font-semibold rounded-lg hover:bg-emerald-500/25 border border-emerald-400/25 text-[11px] transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Parabenizar
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
