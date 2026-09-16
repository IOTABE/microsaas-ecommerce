'use client';

import React, { useState } from 'react';
import { Send, MessageCircle, Mail, Sparkles, CheckCircle2, AlertCircle, Smartphone } from 'lucide-react';

export default function AdminCampaignsPage() {
  const [name, setName] = useState('Semana do Frete Grátis + 10% OFF');
  const [channel, setChannel] = useState<'email' | 'whatsapp' | 'both'>('both');
  const [targetAudience, setTargetAudience] = useState<'all' | 'leads_only' | 'customers_only'>('all');
  const [couponCode, setCouponCode] = useState('PRESENTE10');
  const [subject, setSubject] = useState('🎁 Presente Especial Para Você: 10% OFF + Frete Grátis!');
  const [contentText, setContentText] = useState(
    'Olá {{nome}}! Preparamos uma condição especial para você: ganhe 10% de desconto em todo o catálogo usando o cupom {{cupom}}. Além disso, para compras acima de R$ 150 o frete é por nossa conta com embalagem especial para presente!'
  );

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSendCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/campaigns/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantSlug: 'demo-loja',
          name,
          channel,
          targetAudience,
          subject,
          contentText,
          couponCode,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha no disparo');

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Erro inesperado ao disparar campanha');
    } finally {
      setLoading(false);
    }
  };

  // Preview dinâmico
  const previewText = contentText
    .replace('{{nome}}', 'Mariana')
    .replace('{{cupom}}', couponCode || 'DESCONTO');

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Alertas Promocionais & Campanhas</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Envie ofertas, cupons e novidades diretamente para a base de Leads e Clientes via E-mail e WhatsApp.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário de Criação e Disparo */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Send className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-slate-900 text-sm">Configuração da Campanha</h2>
          </div>

          {result && (
            <div className="p-4 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-start gap-3 border border-emerald-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">{result.message}</p>
                <p className="text-[11px] text-emerald-700 mt-1">
                  Total processado: {result.result?.total} contatos via fila assíncrona.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSendCampaign} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nome Interno da Campanha *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Canal de Envio */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Canais</label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value as any)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="both">WhatsApp & E-mail</option>
                  <option value="whatsapp">Somente WhatsApp</option>
                  <option value="email">Somente E-mail</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Público Alvo</label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value as any)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="all">Todos (Leads + Clientes)</option>
                  <option value="leads_only">Somente Leads (Home)</option>
                  <option value="customers_only">Somente Clientes</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Cupom de Desconto</label>
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="EX: PROMO10"
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg font-mono font-bold text-blue-600"
                />
              </div>
            </div>

            {(channel === 'email' || channel === 'both') && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assunto do E-mail
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Mensagem Promocional *
                </label>
                <span className="text-[10px] text-slate-400">
                  Tags suportadas: <code className="text-blue-600">&#123;&#123;nome&#125;&#125;</code>, <code className="text-blue-600">&#123;&#123;cupom&#125;&#125;</code>
                </span>
              </div>
              <textarea
                rows={4}
                required
                value={contentText}
                onChange={(e) => setContentText(e.target.value)}
                className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="py-3 px-6 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Disparando Fila...' : 'Disparar Campanha para Base'}</span>
            </button>
          </form>
        </div>

        {/* Prévia ao Vivo em Simulador de Mensagem */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 border-b border-slate-100 pb-3">
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span>Pré-visualização (WhatsApp)</span>
          </div>

          <div className="bg-[#efeae2] p-4 rounded-2xl border border-slate-200 min-h-[260px] flex flex-col justify-end">
            <div className="bg-white p-3.5 rounded-2xl rounded-bl-none shadow-sm max-w-xs space-y-2 text-xs text-slate-800">
              <div className="font-bold text-emerald-700 text-[11px] flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Boutique & Presentes Elegance
              </div>
              <p className="leading-relaxed text-[11px] whitespace-pre-line">{previewText}</p>
              <div className="text-[9px] text-slate-400 text-right">11:15</div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 space-y-1">
            <strong className="block text-slate-700">Regras Anti-Spam & LGPD:</strong>
            <p>
              Disparos com intervalos automáticos de 10 a 20 mensagens/segundo via fila assíncrona.
              Link de opt-out/descadastro incluído automaticamente em todas as mensagens.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
