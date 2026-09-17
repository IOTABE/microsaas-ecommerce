import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getStore } from '@/lib/memory-store';
import { z } from 'zod';

const leadSchema = z.object({
  tenantSlug: z.string(),
  name: z.string().min(2, 'Nome muito curto'),
  whatsapp: z.string().min(10, 'WhatsApp deve conter DDD e número'),
  birthDate: z.string().optional(),
  consentLgpd: z.boolean(),
  source: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = leadSchema.parse(body);

    // Tenta persistir no banco via Prisma (se banco configurado) ou mock em memória
    try {
      const tenant = await prisma.tenant.findUnique({
        where: { slug: parsed.tenantSlug },
      });

      if (tenant) {
        const lead = await prisma.lead.upsert({
          where: {
            uq_leads_tenant_whatsapp: {
              tenantId: tenant.id,
              whatsapp: parsed.whatsapp,
            },
          },
          update: {
            name: parsed.name,
            birthDate: parsed.birthDate ? new Date(parsed.birthDate) : undefined,
            updatedAt: new Date(),
          },
          create: {
            tenantId: tenant.id,
            name: parsed.name,
            whatsapp: parsed.whatsapp,
            birthDate: parsed.birthDate ? new Date(parsed.birthDate) : null,
            consentLgpd: parsed.consentLgpd,
            source: parsed.source || 'home_widget',
          },
        });

        return NextResponse.json({ success: true, lead });
      }
    } catch (dbError) {
      console.warn('DB não acessível ou em modo simulado. Gravando lead em modo fallback:', dbError);
    }

    // Retorno em modo desenvolvimento/demonstração (persiste no store em memória)
    const store = getStore();
    const existing = store.leads.find((l) => l.whatsapp === parsed.whatsapp);
    if (existing) {
      existing.name = parsed.name;
      if (parsed.birthDate) existing.birthDate = parsed.birthDate;
      return NextResponse.json({ success: true, lead: existing });
    }

    const lead = {
      id: `lead_${Date.now()}`,
      name: parsed.name,
      whatsapp: parsed.whatsapp,
      birthDate: parsed.birthDate || null,
      source: parsed.source || 'home_widget',
      createdAt: new Date().toISOString(),
    };
    store.leads.unshift(lead);

    return NextResponse.json({ success: true, lead });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.errors?.[0]?.message || err.message || 'Erro ao processar lead' },
      { status: 400 }
    );
  }
}
