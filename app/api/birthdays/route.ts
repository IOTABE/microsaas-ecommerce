import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/db';
import { getStore } from '@/lib/memory-store';
import type { BirthdayPerson } from '@/lib/types';

function parseDate(value: unknown): Date | null {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(String(value));
  return isNaN(d.getTime()) ? null : d;
}

function isBirthdayToday(birthDate: Date, today: Date): boolean {
  return birthDate.getUTCMonth() === today.getMonth() && birthDate.getUTCDate() === today.getDate();
}

function toPerson(
  id: string,
  name: string,
  phone: string,
  email: string | null,
  birthDate: Date,
  type: 'lead' | 'customer',
  today: Date
): BirthdayPerson {
  return {
    id,
    name,
    phone,
    email,
    type,
    birthDate: birthDate.toISOString().slice(0, 10),
    age: today.getFullYear() - birthDate.getUTCFullYear(),
  };
}

export async function GET(req: NextRequest) {
  const tenantSlug = req.nextUrl.searchParams.get('tenantSlug') || 'demo-loja';
  const today = new Date();
  const people: BirthdayPerson[] = [];

  let usedDb = false;
  const prisma = await getPrisma();
  if (prisma) {
    try {
      const tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } });
      if (tenant) {
        usedDb = true;
        const [leads, customers] = await Promise.all([
          prisma.lead.findMany({ where: { tenantId: tenant.id, birthDate: { not: null } } }),
          prisma.customer.findMany({ where: { tenantId: tenant.id, birthDate: { not: null } } }),
        ]);

        for (const l of leads) {
          const d = parseDate(l.birthDate);
          if (d && isBirthdayToday(d, today)) {
            people.push(toPerson(l.id, l.name, l.whatsapp, null, d, 'lead', today));
          }
        }

        for (const c of customers) {
          const d = parseDate(c.birthDate);
          if (d && isBirthdayToday(d, today)) {
            people.push(toPerson(c.id, c.fullName, c.phone, c.email, d, 'customer', today));
          }
        }
      }
    } catch (err) {
      console.warn('[api/birthdays] DB indisponível, usando fallback em memória:', err);
    }
  }

  // Modo demonstração: lê clientes e leads mantidos em memória
  if (!usedDb) {
    const store = getStore();

    for (const c of store.customers) {
      const d = parseDate(c.birthDate);
      if (d && isBirthdayToday(d, today)) {
        people.push(toPerson(c.id, c.fullName, c.phone, c.email, d, 'customer', today));
      }
    }

    for (const l of store.leads) {
      const d = parseDate(l.birthDate);
      if (d && isBirthdayToday(d, today)) {
        people.push(toPerson(l.id, l.name, l.whatsapp, null, d, 'lead', today));
      }
    }
  }

  people.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

  return NextResponse.json({
    date: today.toISOString().slice(0, 10),
    count: people.length,
    source: usedDb ? 'db' : 'memory',
    birthdays: people,
  });
}
