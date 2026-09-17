'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles, ShoppingBag, Users, Megaphone, BarChart3, Truck,
  Shield, Check, ArrowRight, Zap, Star, ChevronDown,
  Store, MessageCircle, Globe, CreditCard, Package, TrendingUp,
  CheckCircle, AlertCircle, Loader2, Mail, Building2, Lock, Phone,
} from 'lucide-react';

// ─── Dados dos planos ────────────────────────────────────────────────────────
const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    icon: Zap,
    color: '#6366f1',
    monthly: 97,
    annual: 77,
    description: 'Ideal para quem está começando',
    features: [
      '1 loja online',
      'Até 100 produtos',
      'Captura de leads ilimitada',
      'Checkout com PIX',
      'Painel administrativo',
      'Suporte por e-mail',
    ],
    cta: 'Começar Grátis',
    highlight: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    icon: Star,
    color: '#2563eb',
    monthly: 197,
    annual: 157,
    description: 'Para negócios em crescimento',
    features: [
      'Até 3 lojas online',
      'Produtos ilimitados',
      'Campanhas WhatsApp & E-mail',
      'Checkout PIX + Cartão',
      'CRM completo de clientes',
      'Automação pós-venda',
      'Suporte prioritário',
    ],
    cta: 'Assinar Pro',
    highlight: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    icon: Shield,
    color: '#0f172a',
    monthly: 397,
    annual: 317,
    description: 'Para operações de grande porte',
    features: [
      'Lojas ilimitadas',
      'API RESTful completa',
      'White-label total',
      'Multi-usuários por loja',
      'Row-Level Security (RLS)',
      'Webhooks customizados',
      'Gerente de conta dedicado',
    ],
    cta: 'Falar com Vendas',
    highlight: false,
  },
];

const FEATURES = [
  {
    icon: ShoppingBag,
    title: 'Loja Personalizada',
    desc: 'Vitrine com branding dinâmico — cores, logo e domínio próprios. Cada cliente tem sua identidade.',
    color: '#6366f1',
  },
  {
    icon: Users,
    title: 'CRM & Captura de Leads',
    desc: 'Widgets de captura com consentimento LGPD, deduplicação automática e histórico completo.',
    color: '#2563eb',
  },
  {
    icon: CreditCard,
    title: 'Checkout Inteligente',
    desc: 'Pagamento via PIX e cartão. Frete grátis acima de R$ 150. Opção de embalagem de presente.',
    color: '#0891b2',
  },
  {
    icon: Megaphone,
    title: 'Campanhas Omnichannel',
    desc: 'Disparo segmentado por WhatsApp e E-mail com tags dinâmicas {{nome}}, {{cupom}} e filas assíncronas.',
    color: '#059669',
  },
  {
    icon: Package,
    title: 'Pipeline de Pedidos',
    desc: 'Kanban de expedição, rastreamento dos Correios e pesquisa de satisfação NPS pós-entrega.',
    color: '#d97706',
  },
  {
    icon: BarChart3,
    title: 'Dashboard de Métricas',
    desc: 'Visão consolidada de vendas, leads, taxa de conversão e performance em tempo real.',
    color: '#dc2626',
  },
];

const STEPS = [
  { n: '01', title: 'Escolha seu plano', desc: 'Selecione o plano ideal e preencha os dados da sua empresa em menos de 2 minutos.' },
  { n: '02', title: 'Receba os acessos', desc: 'Você recebe imediatamente por e-mail a URL da sua loja e os dados de acesso ao painel.' },
  { n: '03', title: 'Comece a vender', desc: 'Cadastre produtos, personalize as cores e divulgue o link da sua loja. É só isso!' },
];

// ─── Helper ──────────────────────────────────────────────────────────────────
function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function LandingPage() {
  const [annual, setAnnual] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('pro');

  // Form state
  const [form, setForm] = useState({
    companyName: '', slug: '', email: '', whatsapp: '', documentCnpj: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; storeUrl?: string; adminUrl?: string; error?: string } | null>(null);

  const setField = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleCompanyName = (v: string) => {
    setField('companyName', v);
    if (!form.slug || form.slug === slugify(form.companyName)) {
      setField('slug', slugify(v));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: form.companyName,
          slug: form.slug,
          email: form.email,
          whatsapp: form.whatsapp.replace(/\D/g, ''),
          documentCnpj: form.documentCnpj || undefined,
          plan: selectedPlan,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao criar loja');
      setResult({ success: true, storeUrl: data.storeUrl, adminUrl: data.adminUrl });
    } catch (err: any) {
      setResult({ success: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#f8fafc', fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* ── Google Font ── */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* ═══════════════════════════════════════════════════
          NAVBAR
      ═══════════════════════════════════════════════════ */}
      <nav style={{
        position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)',
        zIndex: 50, width: 'min(calc(100% - 32px), 1120px)',
        background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)', borderRadius: 9999,
        border: '1px solid rgba(255,255,255,0.7)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Store style={{ width: 18, height: 18, color: 'white' }} />
          </div>
          <span style={{ fontWeight: 800, fontSize: 16, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Micro<span style={{ color: '#2563eb' }}>SaaS</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/admin" style={{
            padding: '8px 18px', borderRadius: 9999, fontSize: 13, fontWeight: 600,
            color: '#475569', textDecoration: 'none', transition: 'all 0.2s',
          }}>
            Entrar
          </Link>
          <a href="#cadastro" style={{
            padding: '8px 20px', borderRadius: 9999, fontSize: 13, fontWeight: 700,
            background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
            color: 'white', textDecoration: 'none',
            boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
          }}>
            Criar minha loja
          </a>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════ */}
      <section style={{
        paddingTop: 120, paddingBottom: 80, textAlign: 'center',
        background: 'linear-gradient(180deg, #eff6ff 0%, #f8fafc 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* blobs decorativos */}
        <div style={{
          position: 'absolute', top: -60, left: '10%', width: 400, height: 400,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(147,197,253,0.35) 0%, transparent 70%)',
          filter: 'blur(40px)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: 40, right: '5%', width: 300, height: 300,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(196,181,253,0.3) 0%, transparent 70%)',
          filter: 'blur(40px)', pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px', position: 'relative' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 9999,
            background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)',
            marginBottom: 28,
          }}>
            <Sparkles style={{ width: 14, height: 14, color: '#2563eb' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Plataforma Multitenant · Whitelabel
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 6vw, 3.8rem)', fontWeight: 900, lineHeight: 1.1,
            color: '#0f172a', letterSpacing: '-0.03em', margin: '0 0 24px',
          }}>
            Sua loja online pronta{' '}
            <span style={{
              background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              em 2 minutos
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', color: '#475569',
            lineHeight: 1.7, maxWidth: 620, margin: '0 auto 40px',
          }}>
            E-commerce completo com CRM, captura de leads, checkout com PIX, campanhas de WhatsApp
            e painel administrativo — tudo em uma única plataforma SaaS.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#cadastro" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 32px', borderRadius: 9999, fontWeight: 700, fontSize: 15,
              background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', color: 'white',
              textDecoration: 'none', boxShadow: '0 8px 24px rgba(37,99,235,0.4)',
              transition: 'transform 0.2s',
            }}>
              <Zap style={{ width: 16, height: 16 }} /> Criar minha loja grátis
            </a>
            <a href="#planos" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 28px', borderRadius: 9999, fontWeight: 600, fontSize: 15,
              background: 'white', color: '#334155', textDecoration: 'none',
              border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}>
              Ver planos <ChevronDown style={{ width: 15, height: 15 }} />
            </a>
          </div>

          {/* Social proof pills */}
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 48, flexWrap: 'wrap' }}>
            {[
              { label: '1.200+', sub: 'lojas ativas' },
              { label: 'R$ 4,2M', sub: 'processados/mês' },
              { label: '99,9%', sub: 'uptime garantido' },
            ].map((s) => (
              <div key={s.label} style={{
                background: 'white', border: '1px solid #e2e8f0',
                borderRadius: 16, padding: '12px 24px', textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#0f172a' }}>{s.label}</div>
                <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero image */}
        <div style={{
          maxWidth: 1000, margin: '56px auto 0', padding: '0 24px',
          position: 'relative',
        }}>
          <div style={{
            borderRadius: 24, overflow: 'hidden',
            boxShadow: '0 32px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.6)',
            border: '1px solid rgba(226,232,240,0.8)',
          }}>
            <Image
              src="/hero-mockup.jpg"
              alt="Painel administrativo do MicroSaaS E-commerce"
              width={1200}
              height={675}
              style={{ width: '100%', height: 'auto', display: 'block' }}
              priority
            />
          </div>
          {/* floating badge */}
          <div style={{
            position: 'absolute', bottom: -16, right: 48,
            background: 'white', borderRadius: 12, padding: '10px 18px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', gap: 8,
            border: '1px solid #e2e8f0',
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>Ao vivo agora</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FEATURES
      ═══════════════════════════════════════════════════ */}
      <section style={{ padding: '96px 24px', maxWidth: 1120, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span style={{
            display: 'inline-block', fontSize: 12, fontWeight: 700, color: '#2563eb',
            textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12,
          }}>Funcionalidades</span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, color: '#0f172a', margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            Tudo que você precisa para vender online
          </h2>
          <p style={{ color: '#64748b', fontSize: 16, maxWidth: 520, margin: '0 auto' }}>
            Uma plataforma completa — sem precisar contratar múltiplos sistemas ou desenvolvedores.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 24,
        }}>
          {FEATURES.map((f) => (
            <div key={f.title} style={{
              background: 'white', borderRadius: 20, padding: '28px 28px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'default',
            }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)';
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: `${f.color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 18,
              }}>
                <f.icon style={{ width: 22, height: 22, color: f.color }} />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          COMO FUNCIONA
      ═══════════════════════════════════════════════════ */}
      <section style={{
        padding: '80px 24px',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <span style={{
            display: 'inline-block', fontSize: 12, fontWeight: 700, color: '#93c5fd',
            textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12,
          }}>Como funciona</span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 800, color: 'white', margin: '0 0 56px', letterSpacing: '-0.02em' }}>
            Do cadastro à primeira venda em 3 passos
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {STEPS.map((s) => (
              <div key={s.n} style={{
                background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)', borderRadius: 20,
                border: '1px solid rgba(255,255,255,0.12)', padding: '32px 28px', textAlign: 'left',
              }}>
                <div style={{
                  fontSize: 40, fontWeight: 900, color: 'rgba(147,197,253,0.3)',
                  fontVariantNumeric: 'tabular-nums', marginBottom: 16, lineHeight: 1,
                }}>{s.n}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: 'white', margin: '0 0 10px' }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          PLANOS
      ═══════════════════════════════════════════════════ */}
      <section id="planos" style={{ padding: '96px 24px', maxWidth: 1120, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span style={{
            display: 'inline-block', fontSize: 12, fontWeight: 700, color: '#2563eb',
            textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12,
          }}>Planos & Preços</span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, color: '#0f172a', margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            Simples, transparente, sem surpresas
          </h2>
          <p style={{ color: '#64748b', fontSize: 16, maxWidth: 440, margin: '0 auto 32px' }}>
            Cancele quando quiser. Sem taxa de setup. Sem contrato de fidelidade.
          </p>

          {/* Toggle mensal/anual */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 12,
            background: '#f1f5f9', borderRadius: 9999, padding: '6px 8px',
          }}>
            <button
              onClick={() => setAnnual(false)}
              style={{
                padding: '8px 20px', borderRadius: 9999, fontWeight: 700, fontSize: 13,
                border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                background: !annual ? 'white' : 'transparent',
                color: !annual ? '#0f172a' : '#64748b',
                boxShadow: !annual ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              Mensal
            </button>
            <button
              onClick={() => setAnnual(true)}
              style={{
                padding: '8px 20px', borderRadius: 9999, fontWeight: 700, fontSize: 13,
                border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                background: annual ? 'white' : 'transparent',
                color: annual ? '#0f172a' : '#64748b',
                boxShadow: annual ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              Anual
              <span style={{
                background: '#dcfce7', color: '#16a34a',
                fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 9999,
              }}>
                20% OFF
              </span>
            </button>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 24, alignItems: 'center',
        }}>
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              style={{
                borderRadius: 24, padding: plan.highlight ? '40px 32px' : '32px 28px',
                border: selectedPlan === plan.id
                  ? `2px solid ${plan.color}`
                  : plan.highlight ? `2px solid ${plan.color}40` : '2px solid #e2e8f0',
                background: plan.highlight
                  ? `linear-gradient(180deg, ${plan.color}08 0%, white 100%)`
                  : 'white',
                position: 'relative', cursor: 'pointer',
                boxShadow: plan.highlight
                  ? '0 16px 48px rgba(37,99,235,0.15)'
                  : '0 2px 12px rgba(0,0,0,0.04)',
                transition: 'all 0.25s',
                transform: plan.highlight ? 'scale(1.03)' : 'scale(1)',
              }}
            >
              {plan.highlight && (
                <div style={{
                  position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                  background: `linear-gradient(135deg, ${plan.color}, #7c3aed)`,
                  color: 'white', fontSize: 11, fontWeight: 800, padding: '4px 16px',
                  borderRadius: 9999, whiteSpace: 'nowrap', letterSpacing: '0.05em',
                }}>
                  ⭐ MAIS POPULAR
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 12,
                  background: `${plan.color}15`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <plan.icon style={{ width: 20, height: 20, color: plan.color }} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 17, color: '#0f172a' }}>{plan.name}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>{plan.description}</div>
                </div>
              </div>

              <div style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4 }}>
                  <span style={{ fontSize: 14, color: '#64748b', fontWeight: 600, marginBottom: 8 }}>R$</span>
                  <span style={{ fontSize: 48, fontWeight: 900, color: '#0f172a', lineHeight: 1, letterSpacing: '-0.03em' }}>
                    {annual ? plan.annual : plan.monthly}
                  </span>
                  <span style={{ fontSize: 14, color: '#94a3b8', marginBottom: 8 }}>/mês</span>
                </div>
                {annual && (
                  <div style={{ fontSize: 12, color: '#16a34a', fontWeight: 600, marginTop: 4 }}>
                    Cobrado anualmente · Você economiza R$ {(plan.monthly - plan.annual) * 12}/ano
                  </div>
                )}
              </div>

              <ul style={{ listStyle: 'none', margin: '0 0 28px', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {plan.features.map((feat) => (
                  <li key={feat} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#334155' }}>
                    <Check style={{ width: 15, height: 15, color: plan.color, flexShrink: 0 }} />
                    {feat}
                  </li>
                ))}
              </ul>

              <a
                href="#cadastro"
                onClick={() => setSelectedPlan(plan.id)}
                style={{
                  display: 'block', textAlign: 'center',
                  padding: '13px 24px', borderRadius: 9999, fontWeight: 700, fontSize: 14,
                  textDecoration: 'none', transition: 'all 0.2s',
                  background: plan.highlight
                    ? `linear-gradient(135deg, ${plan.color}, #1e3a8a)`
                    : selectedPlan === plan.id ? plan.color : 'transparent',
                  color: plan.highlight || selectedPlan === plan.id ? 'white' : plan.color,
                  border: `2px solid ${plan.color}`,
                  boxShadow: plan.highlight ? `0 6px 20px ${plan.color}40` : 'none',
                }}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FORMULÁRIO DE CADASTRO
      ═══════════════════════════════════════════════════ */}
      <section id="cadastro" style={{
        padding: '80px 24px 100px',
        background: 'linear-gradient(180deg, #f8fafc 0%, #eff6ff 100%)',
      }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{
              display: 'inline-block', fontSize: 12, fontWeight: 700, color: '#2563eb',
              textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12,
            }}>Criar Conta Grátis</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, color: '#0f172a', margin: '0 0 12px', letterSpacing: '-0.02em' }}>
              Comece a vender hoje
            </h2>
            <p style={{ color: '#64748b', fontSize: 15 }}>
              Plano selecionado:{' '}
              <strong style={{ color: PLANS.find((p) => p.id === selectedPlan)?.color }}>
                {PLANS.find((p) => p.id === selectedPlan)?.name} ·{' '}
                R$ {annual
                  ? PLANS.find((p) => p.id === selectedPlan)?.annual
                  : PLANS.find((p) => p.id === selectedPlan)?.monthly}/mês{annual ? ' (anual)' : ''}
              </strong>
            </p>
          </div>

          {result?.success ? (
            /* ── Sucesso ── */
            <div style={{
              background: 'white', borderRadius: 24, padding: 48,
              boxShadow: '0 8px 40px rgba(0,0,0,0.08)', textAlign: 'center',
              border: '1px solid #d1fae5',
            }}>
              <div style={{
                width: 80, height: 80, borderRadius: '50%',
                background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px',
              }}>
                <CheckCircle style={{ width: 40, height: 40, color: '#16a34a' }} />
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>
                🎉 Loja criada com sucesso!
              </h3>
              <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.7, margin: '0 0 32px' }}>
                Os dados de acesso foram enviados para o seu e-mail. Verifique também a caixa de spam.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href={result.storeUrl || '/'} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '12px 28px', borderRadius: 9999, fontWeight: 700, fontSize: 14,
                  background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', color: 'white', textDecoration: 'none',
                }}>
                  <Store style={{ width: 15, height: 15 }} /> Ver minha loja
                </Link>
                <Link href="/admin" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '12px 28px', borderRadius: 9999, fontWeight: 700, fontSize: 14,
                  background: '#f1f5f9', color: '#334155', textDecoration: 'none',
                  border: '1px solid #e2e8f0',
                }}>
                  <Shield style={{ width: 15, height: 15 }} /> Acessar painel
                </Link>
              </div>
            </div>
          ) : (
            /* ── Formulário ── */
            <form
              onSubmit={handleSubmit}
              style={{
                background: 'white', borderRadius: 24, padding: 'clamp(24px, 5vw, 48px)',
                boxShadow: '0 8px 40px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0',
              }}
            >
              {result?.error && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: '#fef2f2', border: '1px solid #fecaca',
                  borderRadius: 12, padding: '12px 16px', marginBottom: 24,
                }}>
                  <AlertCircle style={{ width: 16, height: 16, color: '#dc2626', flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: '#dc2626', fontWeight: 500 }}>{result.error}</span>
                </div>
              )}

              {/* Seletor de plano no form */}
              <div style={{ marginBottom: 28 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Plano escolhido
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {PLANS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPlan(p.id)}
                      style={{
                        padding: '10px 8px', borderRadius: 12, border: '2px solid',
                        borderColor: selectedPlan === p.id ? p.color : '#e2e8f0',
                        background: selectedPlan === p.id ? `${p.color}10` : 'transparent',
                        cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 800, color: selectedPlan === p.id ? p.color : '#64748b' }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>
                        R$ {annual ? p.annual : p.monthly}/mês
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {/* Nome da empresa */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>
                    <Building2 style={labelIconStyle} /> Nome da Empresa
                  </label>
                  <input
                    type="text"
                    required
                    value={form.companyName}
                    onChange={(e) => handleCompanyName(e.target.value)}
                    placeholder="Ex: Moda & Estilo LTDA"
                    style={inputStyle}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#2563eb'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  />
                </div>

                {/* Slug da loja */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>
                    <Globe style={labelIconStyle} /> Endereço da Loja
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{
                      position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                      fontSize: 13, color: '#94a3b8', fontWeight: 500, userSelect: 'none',
                    }}>
                      meusaas.com/
                    </span>
                    <input
                      type="text"
                      required
                      value={form.slug}
                      onChange={(e) => setField('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      placeholder="minha-loja"
                      style={{ ...inputStyle, paddingLeft: 120 }}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#2563eb'}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                    />
                  </div>
                </div>

                {/* E-mail */}
                <div>
                  <label style={labelStyle}>
                    <Mail style={labelIconStyle} /> E-mail de Acesso
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setField('email', e.target.value)}
                    placeholder="voce@empresa.com"
                    style={inputStyle}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#2563eb'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  />
                </div>

                {/* WhatsApp */}
                <div>
                  <label style={labelStyle}>
                    <MessageCircle style={labelIconStyle} /> WhatsApp (com DDD)
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.whatsapp}
                    onChange={(e) => setField('whatsapp', e.target.value)}
                    placeholder="(11) 98765-4321"
                    style={inputStyle}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#2563eb'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  />
                </div>

                {/* CNPJ opcional */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>
                    <Lock style={labelIconStyle} /> CNPJ <span style={{ color: '#94a3b8', fontWeight: 400 }}>(opcional)</span>
                  </label>
                  <input
                    type="text"
                    value={form.documentCnpj}
                    onChange={(e) => setField('documentCnpj', e.target.value)}
                    placeholder="00.000.000/0001-00"
                    style={inputStyle}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#2563eb'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  />
                </div>
              </div>

              {/* Info sobre senha */}
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                background: '#eff6ff', border: '1px solid #bfdbfe',
                borderRadius: 12, padding: '12px 16px', margin: '20px 0',
              }}>
                <Mail style={{ width: 15, height: 15, color: '#2563eb', flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: 12, color: '#1d4ed8', margin: 0, lineHeight: 1.6 }}>
                  Uma <strong>senha de acesso temporária</strong> será gerada automaticamente e enviada para o seu e-mail junto com os links da sua loja e do painel administrativo.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', padding: '15px 24px', borderRadius: 9999,
                  border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: 800, fontSize: 15, transition: 'all 0.25s',
                  background: loading ? '#94a3b8' : 'linear-gradient(135deg, #1e3a8a, #2563eb)',
                  color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  boxShadow: loading ? 'none' : '0 8px 24px rgba(37,99,235,0.4)',
                }}
              >
                {loading ? (
                  <><Loader2 style={{ width: 18, height: 18, animation: 'spin 1s linear infinite' }} /> Criando sua loja...</>
                ) : (
                  <><Zap style={{ width: 16, height: 16 }} /> Criar minha loja agora</>
                )}
              </button>

              <p style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', marginTop: 16, lineHeight: 1.6 }}>
                Ao criar sua conta, você concorda com os{' '}
                <a href="#" style={{ color: '#2563eb', textDecoration: 'none' }}>Termos de Serviço</a>{' '}
                e{' '}
                <a href="#" style={{ color: '#2563eb', textDecoration: 'none' }}>Política de Privacidade</a>.
                Seus dados são protegidos conforme a LGPD.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════ */}
      <footer style={{
        background: '#0f172a', padding: '48px 24px', textAlign: 'center',
      }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 24 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9,
              background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Store style={{ width: 16, height: 16, color: 'white' }} />
            </div>
            <span style={{ fontWeight: 800, fontSize: 16, color: 'white' }}>
              Micro<span style={{ color: '#60a5fa' }}>SaaS</span>
            </span>
          </div>
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
            {['Demos de Loja', 'Painel Admin', 'Documentação', 'Suporte'].map((item, i) => (
              <a
                key={item}
                href={i === 0 ? '/demo-loja' : i === 1 ? '/admin' : '#'}
                style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'white')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
              >
                {item}
              </a>
            ))}
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', margin: 0 }}>
            © {new Date().getFullYear()} MicroSaaS E-commerce. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        a { transition: opacity 0.2s; }
        input { transition: border-color 0.2s, box-shadow 0.2s; }
      `}</style>
    </div>
  );
}

// ─── Styles helpers ───────────────────────────────────────────────────────────
const labelStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 6,
  fontSize: 12, fontWeight: 700, color: '#374151',
  marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em',
};
const labelIconStyle: React.CSSProperties = { width: 13, height: 13, color: '#2563eb' };
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 16px', borderRadius: 12,
  border: '1.5px solid #e2e8f0', fontSize: 14, color: '#0f172a',
  background: '#f8fafc', outline: 'none', fontFamily: 'inherit',
};
