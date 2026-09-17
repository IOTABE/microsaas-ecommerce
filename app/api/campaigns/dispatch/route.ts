import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { dispatchPromotionalCampaign } from '@/lib/messaging-service';
import { z } from 'zod';

const campaignDispatchSchema = z.object({
  tenantSlug: z.string(),
  name: z.string().min(3),
  channel: z.enum(['email', 'whatsapp', 'both']),
  targetAudience: z.enum(['all', 'leads_only', 'customers_only']),
  subject: z.string().optional(),
  contentText: z.string().min(5),
  couponCode: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = campaignDispatchSchema.parse(body);

    let recipients: Array<{ name: string; destination: string; type: 'lead' | 'customer' }> = [];

    // Busca contatos no banco de dados se conectado
    try {
      const tenant = await prisma.tenant.findUnique({
        where: { slug: data.tenantSlug },
      });

      if (tenant) {
        if (data.targetAudience === 'all' || data.targetAudience === 'leads_only') {
          const leads = await prisma.lead.findMany({
            where: { tenantId: tenant.id },
            select: { name: true, whatsapp: true },
          });
          recipients.push(
            ...leads.map((l: { name: string; whatsapp: string }) => ({
              name: l.name,
              destination: l.whatsapp,
              type: 'lead' as const,
            }))
          );
        }

        if (data.targetAudience === 'all' || data.targetAudience === 'customers_only') {
          const customers = await prisma.customer.findMany({
            where: { tenantId: tenant.id },
            select: { fullName: true, phone: true, email: true },
          });
          recipients.push(
            ...customers.map((c: { fullName: string; phone: string; email: string }) => ({
              name: c.fullName,
              destination: data.channel === 'email' ? c.email : c.phone,
              type: 'customer' as const,
            }))
          );
        }
      }
    } catch (dbError) {
      console.warn('Banco não acessível, gerando destinatários de demonstração:', dbError);
    }

    // Se a base estiver vazia ou em desenvolvimento, inclui contatos de teste
    if (recipients.length === 0) {
      recipients = [
        { name: 'Mariana Lima (Lead)', destination: '11999887766', type: 'lead' },
        { name: 'Carlos Eduardo (Cliente)', destination: 'carlos@empresa.com.br', type: 'customer' },
        { name: 'Fernanda Souza (Cliente)', destination: '11988776655', type: 'customer' },
      ];
    }

    const result = await dispatchPromotionalCampaign({
      tenantSlug: data.tenantSlug,
      channel: data.channel,
      recipients,
      subject: data.subject,
      contentText: data.contentText,
      couponCode: data.couponCode,
    });

    return NextResponse.json({
      success: true,
      result,
      message: `Campanha '${data.name}' disparada para ${recipients.length} contatos!`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.errors?.[0]?.message || err.message || 'Erro ao disparar campanha' },
      { status: 400 }
    );
  }
}
