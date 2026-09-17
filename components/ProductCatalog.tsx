'use client';

import React from 'react';
import { ShoppingBag, Plus, Star } from 'lucide-react';
import { CartItem, ProductData } from '@/lib/types';

interface ProductCatalogProps {
  products: ProductData[];
  onAddToCart: (item: CartItem) => void;
}

export function ProductCatalog({ products, onAddToCart }: ProductCatalogProps) {
  return (
    <section className="my-10 max-w-6xl mx-auto px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Catálogo de Produtos</h2>
          <p className="text-sm text-gray-500">Escolha seus itens favoritos e receba em casa</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col"
          >
            {/* Imagem do Produto */}
            <div className="relative aspect-square w-full bg-gray-100 overflow-hidden">
              <img
                src={
                  product.imageUrl ||
                  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=400&fit=crop'
                }
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              {product.isFeatured && (
                <span className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                  <Star className="w-3 h-3 fill-current" /> Destaque
                </span>
              )}
            </div>

            {/* Informações */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono text-gray-400 block mb-1">
                  SKU: {product.sku}
                </span>
                <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1 group-hover:text-tenant-primary transition">
                  {product.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2 mb-3">{product.description}</p>
              </div>

              <div>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-lg font-bold text-gray-900">
                    R$ {product.price.toFixed(2)}
                  </span>
                  <span className="text-[11px] text-gray-400">
                    {product.stockQuantity} em estoque
                  </span>
                </div>

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
                  className="w-full py-2.5 px-3 bg-gray-900 text-white text-xs font-semibold rounded-xl hover:bg-black transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
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
