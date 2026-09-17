import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getPrisma } from '@/lib/db';
import { getStore } from '@/lib/memory-store';
import type { CustomerData } from '@/lib/types';

const customerSchema = z.object({
  tenantSlug: z.string().optional().default('demo-loja'),
  fullName: z.string().min(2, 'Nome muito curto'),
  documentCpfCnpj: z.string().min(5, 'CPF/CNPJ inválido'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(8, 'Telefone inválido'),
  city: z.string().optional().default(''),
  state: z.string().optional().default(''),
  birthDate: z.string().optional().nullable(),
});

function serialize(c: any): CustomerData {
  const addr = c.addresses?.[0];
  return {
    id: c.id,
    fullName: c.fullName,
    documentCpfCnpj: c.documentCpfCnpj,
    email: c.email,
    phone: c.phone,
    city: addr?.city ?? '',
    state: addr?.state ?? '',
    birthDate: c.birthDate ? new Date(c.birthDate).toISOString().slice(0, 10) : null,
    totalOrders: c._count?.orders ?? 0,
  };
}

export async function GET(req: NextRequest) {
  const tenantSlug = req.nextUrl.searchParams.get('tenantSlug') || 'demo-loja';

  const prisma = await getPrisma();
  if (prisma) {
    try {
      const tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } });
      if (tenant) {
        const customers = await prisma.customer.findMany({
          where: { tenantId: tenant.id },
          orderBy: { createdAt: 'desc' },
          include: {
            addresses: { where: { isDefault: true }, take: 1 },
            _count: { select: { orders: true } },
          },
        });
        return NextResponse.json({ customers: customers.map(serialize), source: 'db' });
      }
    } catch (err) {
      console.warn('[api/customers] DB indisponível, usando fallback em memória:', err);
    }
  }

  return NextResponse.json({ customers: getStore().customers, source: 'memory' });
}

export async function POST(req: NextRequest) {
  try {
    const parsed = customerSchema.parse(await req.json());

    const prisma = await getPrisma();
    if (prisma) {
      try {
        const tenant = await prisma.tenant.findUnique({ where: { slug: parsed.tenantSlug } });
        if (tenant) {
          const created = await prisma.customer.create({
            data: {
              tenantId: tenant.id,
              fullName: parsed.fullName,
              documentCpfCnpj: parsed.documentCpfCnpj,
              email: parsed.email,
              phone: parsed.phone,
              birthDate: parsed.birthDate ? new Date(parsed.birthDate) : null,
              addresses: {
                create: {
                  tenantId: tenant.id,
                  zipCode: '',
                  street: '',
                  number: '',
                  neighborhood: '',
                  city: parsed.city || '',
                  state: (parsed.state || '').toUpperCase(),
                  isDefault: true,
                },
              },
            },
            include: {
              addresses: { where: { isDefault: true }, take: 1 },
              _count: { select: { orders: true } },
            },
          });
          return NextResponse.json({ customer: serialize(created), source: 'db' }, { status: 201 });
        }
      } catch (err) {
        console.warn('[api/customers] Falha ao gravar no DB, usando fallback:', err);
      }
    }

    const store = getStore();
    const customer: CustomerData = {
      id: `cust_${Date.now()}`,
      fullName: parsed.fullName,
      documentCpfCnpj: parsed.documentCpfCnpj,
      email: parsed.email,
      phone: parsed.phone,
      city: parsed.city || '',
      state: (parsed.state || '').toUpperCase(),
      birthDate: parsed.birthDate || null,
      totalOrders: 0,
    };
    store.customers.unshift(customer);

    return NextResponse.json({ customer, source: 'memory' }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.errors?.[0]?.message || err.message || 'Erro ao criar cliente' },
      { status: 400 }
    );
  }
}
