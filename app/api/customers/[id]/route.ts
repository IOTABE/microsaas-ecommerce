import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getPrisma } from '@/lib/db';
import { getStore } from '@/lib/memory-store';
import type { CustomerData } from '@/lib/types';

const customerUpdateSchema = z.object({
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

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const parsed = customerUpdateSchema.parse(await req.json());
    const { id } = await params;
    const state = (parsed.state || '').toUpperCase();

    const prisma = await getPrisma();
    if (prisma) {
      try {
        const updated = await prisma.customer.update({
          where: { id },
          data: {
            fullName: parsed.fullName,
            documentCpfCnpj: parsed.documentCpfCnpj,
            email: parsed.email,
            phone: parsed.phone,
            birthDate: parsed.birthDate ? new Date(parsed.birthDate) : null,
          },
        });

        const existingAddress = await prisma.customerAddress.findFirst({
          where: { customerId: id, isDefault: true },
        });

        if (existingAddress) {
          await prisma.customerAddress.update({
            where: { id: existingAddress.id },
            data: { city: parsed.city || '', state },
          });
        } else {
          await prisma.customerAddress.create({
            data: {
              tenantId: updated.tenantId,
              customerId: id,
              zipCode: '',
              street: '',
              number: '',
              neighborhood: '',
              city: parsed.city || '',
              state,
              isDefault: true,
            },
          });
        }

        const full = await prisma.customer.findUnique({
          where: { id },
          include: {
            addresses: { where: { isDefault: true }, take: 1 },
            _count: { select: { orders: true } },
          },
        });

        return NextResponse.json({ customer: serialize(full), source: 'db' });
      } catch (err) {
        console.warn('[api/customers/:id] Falha ao atualizar no DB, usando fallback:', err);
      }
    }

    const store = getStore();
    const index = store.customers.findIndex((c) => c.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 });
    }

    const customer: CustomerData = {
      ...store.customers[index],
      fullName: parsed.fullName,
      documentCpfCnpj: parsed.documentCpfCnpj,
      email: parsed.email,
      phone: parsed.phone,
      city: parsed.city || '',
      state,
      birthDate: parsed.birthDate || null,
    };
    store.customers[index] = customer;

    return NextResponse.json({ customer, source: 'memory' });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.errors?.[0]?.message || err.message || 'Erro ao atualizar cliente' },
      { status: 400 }
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const prisma = await getPrisma();
  if (prisma) {
    try {
      await prisma.customer.delete({ where: { id } });
      return NextResponse.json({ success: true, source: 'db' });
    } catch (err) {
      console.warn('[api/customers/:id] Falha ao excluir no DB, usando fallback:', err);
    }
  }

  const store = getStore();
  const before = store.customers.length;
  store.customers = store.customers.filter((c) => c.id !== id);
  if (store.customers.length === before) {
    return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 });
  }

  return NextResponse.json({ success: true, source: 'memory' });
}
