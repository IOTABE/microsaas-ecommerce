import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';

const signupSchema = z.object({
  companyName: z.string().min(2, 'Nome da empresa muito curto'),
  slug: z
    .string()
    .min(3, 'Slug muito curto')
    .max(64, 'Slug muito longo')
    .regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens'),
  email: z.string().email('E-mail inválido'),
  whatsapp: z.string().min(10, 'WhatsApp inválido'),
  plan: z.enum(['starter', 'pro', 'enterprise']).default('starter'),
  documentCnpj: z.string().optional(),
});

function generateTempPassword(length = 12): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#!';
  return Array.from(crypto.randomBytes(length))
    .map((b) => chars[b % chars.length])
    .join('');
}

async function hashPassword(password: string): Promise<string> {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function sendWelcomeEmail({
  to, companyName, slug, password,
}: { to: string; companyName: string; slug: string; password: string }) {
  const resendKey = process.env.RESEND_API_KEY;
  const emailFrom = process.env.EMAIL_FROM || 'noreply@meusaas.com';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"/></head>
  <body style="font-family:system-ui,sans-serif;background:#f8fafc;padding:32px;">
    <div style="max-width:560px;margin:0 auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
      <div style="background:linear-gradient(135deg,#1e3a8a 0%,#2563eb 100%);padding:32px;text-align:center;">
        <h1 style="color:white;margin:0;font-size:24px;">🎉 Bem-vindo ao MicroSaaS!</h1>
        <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px;">Sua loja está pronta para decolar</p>
      </div>
      <div style="padding:32px;">
        <p style="color:#334155;font-size:15px;">Olá, <strong>${companyName}</strong>!</p>
        <p style="color:#64748b;font-size:14px;line-height:1.6;">Seu cadastro foi realizado com sucesso. Abaixo estão os dados de acesso à sua loja e painel administrativo.</p>
        <div style="background:#f1f5f9;border-radius:12px;padding:20px;margin:24px 0;">
          <h3 style="margin:0 0 16px;color:#1e293b;font-size:14px;text-transform:uppercase;letter-spacing:0.05em;">Dados de Acesso</h3>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:6px 0;color:#64748b;font-size:13px;width:140px;">🛍️ Sua Loja</td><td><a href="${baseUrl}/${slug}" style="color:#2563eb;font-weight:600;">${baseUrl}/${slug}</a></td></tr>
            <tr><td style="padding:6px 0;color:#64748b;font-size:13px;">⚙️ Painel Admin</td><td><a href="${baseUrl}/admin" style="color:#2563eb;font-weight:600;">${baseUrl}/admin</a></td></tr>
            <tr><td style="padding:6px 0;color:#64748b;font-size:13px;">📧 Login</td><td style="color:#1e293b;font-weight:600;">${to}</td></tr>
            <tr><td style="padding:6px 0;color:#64748b;font-size:13px;">🔑 Senha</td><td><span style="font-family:monospace;background:#e2e8f0;padding:4px 8px;border-radius:6px;color:#1e293b;font-weight:700;">${password}</span></td></tr>
          </table>
        </div>
        <p style="color:#ef4444;font-size:12px;background:#fef2f2;padding:12px 16px;border-radius:8px;border-left:3px solid #ef4444;">⚠️ Recomendamos que você altere sua senha no primeiro acesso.</p>
        <div style="text-align:center;margin-top:28px;">
          <a href="${baseUrl}/admin" style="display:inline-block;background:linear-gradient(135deg,#1e3a8a,#2563eb);color:white;text-decoration:none;padding:14px 32px;border-radius:50px;font-weight:700;font-size:14px;">Acessar Meu Painel →</a>
        </div>
      </div>
      <div style="background:#f8fafc;padding:20px 32px;text-align:center;border-top:1px solid #e2e8f0;">
        <p style="color:#94a3b8;font-size:12px;margin:0;">MicroSaaS E-commerce · suporte@meusaas.com</p>
      </div>
    </div>
  </body></html>`;

  if (!resendKey || resendKey.startsWith('re_xxx')) {
    console.log('[SIGNUP] Email (mock) to:', to);
    console.log('[SIGNUP] Loja:', `${baseUrl}/${slug}`, '| Senha temp:', password);
    return;
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: emailFrom, to: [to], subject: `🎉 Bem-vindo, ${companyName}! Dados da sua loja`, html }),
  });
  if (!res.ok) console.warn('[SIGNUP] Resend error:', await res.text());
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = signupSchema.parse(body);

    const tempPassword = generateTempPassword();
    const passwordHash = await hashPassword(tempPassword);

    try {
      const { prisma } = await import('@/lib/prisma');
      const existing = await prisma.tenant.findUnique({ where: { slug: parsed.slug } });
      if (existing) {
        return NextResponse.json({ error: 'Este endereço de loja já está em uso. Tente outro.' }, { status: 409 });
      }

      const tenant = await prisma.tenant.create({
        data: {
          slug: parsed.slug,
          companyName: parsed.companyName,
          documentCnpj: parsed.documentCnpj || null,
          planTier: parsed.plan,
          isActive: true,
          branding: {
            create: {
              primaryColor: '#2563eb',
              secondaryColor: '#1e293b',
              backgroundColor: '#f8fafc',
              deliveryFeeBelowThreshold: 15.0,
            },
          },
          users: {
            create: {
              name: parsed.companyName,
              email: parsed.email,
              passwordHash,
              role: 'owner',
              isActive: true,
            },
          },
        },
      });

      sendWelcomeEmail({ to: parsed.email, companyName: parsed.companyName, slug: parsed.slug, password: tempPassword })
        .catch((e) => console.warn('[SIGNUP] Email failed:', e));

      return NextResponse.json({ success: true, slug: tenant.slug, storeUrl: `/${tenant.slug}`, adminUrl: '/admin' });
    } catch (dbError: any) {
      if (dbError?.code === 'P2002') {
        return NextResponse.json({ error: 'Este endereço de loja já está em uso. Tente outro.' }, { status: 409 });
      }
      console.warn('[SIGNUP] DB não acessível. Modo fallback:', dbError?.message);
    }

    await sendWelcomeEmail({ to: parsed.email, companyName: parsed.companyName, slug: parsed.slug, password: tempPassword });

    return NextResponse.json({
      success: true,
      slug: parsed.slug,
      storeUrl: `/${parsed.slug}`,
      adminUrl: '/admin',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.errors?.[0]?.message || err.message || 'Erro ao processar cadastro' },
      { status: 400 }
    );
  }
}
