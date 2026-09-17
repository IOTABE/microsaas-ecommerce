'use client';

import React from 'react';
import { ShoppingBag, Plus, Star, Sparkles } from 'lucide-react';
import { CartItem } from '@/lib/types';

interface Product {
  id: string;
  sku: string;
  title: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  isFeatured: boolean;
}

interface ProductCatalogProps {
  products: Product[];
  onAddToCart: (item: CartItem) => void;
}

export function ProductCatalog({ products, onAddToCart }: ProductCatalogProps) {
  return (
    <section className="my-10 max-w-6xl mx-auto px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Nossa Seleção Especial
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Catálogo de Produtos
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Escolha itens exclusivos e receba em casa com embalagem especial
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="group glass-card p-3.5 shadow-glass hover:shadow-glass-hover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
          >
            {/* Imagem do Produto com cantos arredondados Material You */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100/60 mb-3.5 shadow-inner">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              {product.isFeatured && (
                <span className="absolute top-3 left-3 bg-amber-500/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm border border-white/30">
                  <Star className="w-3 h-3 fill-current" /> Destaque
                </span>
              )}
            </div>

            {/* Informações */}
            <div className="flex-1 flex flex-col justify-between px-1">
              <div>
                <span className="text-[10px] font-mono text-slate-400 block mb-1">
                  SKU: {product.sku}
                </span>
                <h3 className="font-bold text-slate-900 text-sm line-clamp-2 mb-1.5 group-hover:text-tenant-primary transition">
                  {product.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100/60">
                <div className="flex items-baseline justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Preço</span>
                    <span className="text-lg font-black text-slate-900 tracking-tight">
                      R$ {product.price.toFixed(2)}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-100/80 px-2 py-0.5 rounded-full">
                    {product.stockQuantity} unid.
                  </span>
                </div>

                {/* Botão Material You Pílula com State Layer */}
                <button
                  onClick={() =>
                    onAddToCart({
                      productId: product.id,
                      sku: product.sku,
                      title: product.title,
                      price: product.price,
                      quantity: 1,
                      imageUrl: product.imageUrl,
                    })
                  }
                  className="w-full py-2.5 px-4 m3-button bg-slate-900 text-white text-xs font-semibold hover:bg-black flex items-center justify-center gap-2 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar à Sacola</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
