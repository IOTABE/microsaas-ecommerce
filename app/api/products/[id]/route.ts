import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getPrisma } from '@/lib/db';
import { getStore } from '@/lib/memory-store';
import type { ProductData } from '@/lib/types';

const productUpdateSchema = z.object({
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

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const parsed = productUpdateSchema.parse(await req.json());
    const { id } = await params;

    const prisma = await getPrisma();
    if (prisma) {
      try {
        const updated = await prisma.product.update({
          where: { id },
          data: {
            sku: parsed.sku,
            title: parsed.title,
            description: parsed.description || null,
            price: parsed.price,
            stockQuantity: parsed.stockQuantity,
            imageUrl: parsed.imageUrl || null,
            isFeatured: parsed.isFeatured,
          },
        });
        return NextResponse.json({ product: serialize(updated), source: 'db' });
      } catch (err) {
        console.warn('[api/products/:id] Falha ao atualizar no DB, usando fallback:', err);
      }
    }

    const store = getStore();
    const index = store.products.findIndex((p) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
    }

    const product: ProductData = {
      id,
      sku: parsed.sku,
      title: parsed.title,
      description: parsed.description || '',
      price: parsed.price,
      stockQuantity: parsed.stockQuantity,
      imageUrl: parsed.imageUrl || null,
      isFeatured: parsed.isFeatured,
    };
    store.products[index] = product;

    return NextResponse.json({ product, source: 'memory' });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.errors?.[0]?.message || err.message || 'Erro ao atualizar produto' },
      { status: 400 }
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const prisma = await getPrisma();
  if (prisma) {
    try {
      await prisma.product.delete({ where: { id } });
      return NextResponse.json({ success: true, source: 'db' });
    } catch (err) {
      console.warn('[api/products/:id] Falha ao excluir no DB, usando fallback:', err);
    }
  }

  const store = getStore();
  const before = store.products.length;
  store.products = store.products.filter((p) => p.id !== id);
  if (store.products.length === before) {
    return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
  }

  return NextResponse.json({ success: true, source: 'memory' });
}
