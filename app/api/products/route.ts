import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getPrisma } from '@/lib/db';
import { getStore } from '@/lib/memory-store';
import type { ProductData } from '@/lib/types';

const productSchema = z.object({
  tenantSlug: z.string().optional().default('demo-loja'),
  sku: z.string().min(1, 'SKU obrigatório'),
  title: z.string().min(2, 'Título muito curto'),
  description: z.string().optional().default(''),
  price: z.coerce.number().nonnegative(),
  stockQuantity: z.coerce.number().int().nonnegative(),
  imageUrl: z.string().optional().nullable(),
  isFeatured: z.boolean().optional().default(false),
});

function serialize(p: any): ProductData {
  return {
    id: p.id,
    sku: p.sku,
    title: p.title,
    description: p.description ?? '',
    price: Number(p.price),
    stockQuantity: p.stockQuantity,
    imageUrl: p.imageUrl ?? null,
    isFeatured: Boolean(p.isFeatured),
  };
}

export async function GET(req: NextRequest) {
  const tenantSlug = req.nextUrl.searchParams.get('tenantSlug') || 'demo-loja';

  const prisma = await getPrisma();
  if (prisma) {
    try {
      const tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } });
      if (tenant) {
        const products = await prisma.product.findMany({
          where: { tenantId: tenant.id },
          orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json({ products: products.map(serialize), source: 'db' });
      }
    } catch (err) {
      console.warn('[api/products] DB indisponível, usando fallback em memória:', err);
    }
  }

  return NextResponse.json({ products: getStore().products, source: 'memory' });
}

export async function POST(req: NextRequest) {
  try {
    const parsed = productSchema.parse(await req.json());

    const prisma = await getPrisma();
    if (prisma) {
      try {
        const tenant = await prisma.tenant.findUnique({ where: { slug: parsed.tenantSlug } });
        if (tenant) {
          const created = await prisma.product.create({
            data: {
              tenantId: tenant.id,
              sku: parsed.sku,
              title: parsed.title,
              description: parsed.description || null,
              price: parsed.price,
              stockQuantity: parsed.stockQuantity,
              imageUrl: parsed.imageUrl || null,
              isFeatured: parsed.isFeatured,
            },
          });
          return NextResponse.json({ product: serialize(created), source: 'db' }, { status: 201 });
        }
      } catch (err) {
        console.warn('[api/products] Falha ao gravar no DB, usando fallback:', err);
      }
    }

    const store = getStore();
    const product: ProductData = {
      id: `prod_${Date.now()}`,
      sku: parsed.sku,
      title: parsed.title,
      description: parsed.description || '',
      price: parsed.price,
      stockQuantity: parsed.stockQuantity,
      imageUrl: parsed.imageUrl || null,
      isFeatured: parsed.isFeatured,
    };
    store.products.unshift(product);

    return NextResponse.json({ product, source: 'memory' }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.errors?.[0]?.message || err.message || 'Erro ao criar produto' },
      { status: 400 }
    );
  }
}
