'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getTenantBySlug, DEMO_PRODUCTS } from '@/lib/tenant';
import { BrandingProvider } from '@/components/BrandingProvider';
import { Navbar } from '@/components/Navbar';
import { LeadWidget } from '@/components/LeadWidget';
import { ProductCatalog } from '@/components/ProductCatalog';
import { CartDrawer } from '@/components/CartDrawer';
import { CartItem, ProductData } from '@/lib/types';
import { Sparkles, Heart } from 'lucide-react';

export default function TenantStorefrontPage() {
  const params = useParams();
  const tenantSlug = typeof params.tenantSlug === 'string' ? params.tenantSlug : 'demo-loja';
  const tenant = getTenantBySlug(tenantSlug);

  const [products, setProducts] = useState<ProductData[]>(DEMO_PRODUCTS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isGift, setIsGift] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');

  // Carrega catálogo da API (com fallback para os dados de demonstração)
  useEffect(() => {
    let active = true;
    fetch(`/api/products?tenantSlug=${tenantSlug}`)
      .then((res) => res.json())
      .then((data) => {
        if (active && Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
        }
      })
      .catch(() => {
        /* mantém os produtos de demonstração */
      });
    return () => {
      active = false;
    };
  }, [tenantSlug]);

  // Carrega carrinho do localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`cart_${tenantSlug}`);
    if (saved) {
      try {
        setCartItems(JSON.parse(saved));
      } catch (e) {
        console.error('Erro ao ler carrinho:', e);
      }
    }
  }, [tenantSlug]);

  // Salva carrinho no localStorage
  useEffect(() => {
    localStorage.setItem(`cart_${tenantSlug}`, JSON.stringify(cartItems));
  }, [cartItems, tenantSlug]);

  const handleAddToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, item];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const totalItemsCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <BrandingProvider tenant={tenant}>
      <div className="min-h-screen flex flex-col relative overflow-hidden bg-slate-50/80">
        {/* Esferas de Luz Ambiente do Glassmorphism (Mesh Gradient Orbs) */}
        <div
          className="absolute top-0 -left-20 w-96 h-96 rounded-full blur-3xl opacity-25 pointer-events-none"
          style={{ backgroundColor: 'var(--primary-color, #2563eb)' }}
        />
        <div className="absolute top-40 -right-20 w-96 h-96 rounded-full blur-3xl opacity-20 bg-rose-400 pointer-events-none" />
        <div className="absolute bottom-60 left-1/3 w-80 h-80 rounded-full blur-3xl opacity-15 bg-amber-300 pointer-events-none" />

        {/* Navbar Flutuante */}
        <Navbar
          tenant={tenant}
          cartCount={totalItemsCount}
          onOpenCart={() => setIsCartOpen(true)}
        />

        {/* Hero Banner em Card de Vidro Fosco (Glassmorphism & Material You) */}
        <section className="pt-8 pb-4 px-4">
          <div className="max-w-4xl mx-auto glass-card p-8 sm:p-12 text-center relative overflow-hidden shadow-glass">
            <div className="inline-flex items-center gap-2 text-xs font-bold px-3.5 py-1.5 rounded-full bg-white/80 border border-white/60 shadow-sm text-slate-700 mb-4 backdrop-blur-md">
              <Sparkles
                className="w-3.5 h-3.5"
                style={{ color: 'var(--primary-color, #2563eb)' }}
              />
              <span>Loja Oficial Multitenant</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-3">
              {tenant.companyName}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto leading-relaxed">
              Itens exclusivos com curadoria especial. Frete Grátis em compras acima de R$ 150,00 e
              embalagem premium personalizada para presente!
            </p>
          </div>
        </section>

        {/* Receptor de Leads na Tela Principal */}
        <div className="px-4">
          <LeadWidget tenantSlug={tenant.slug} />
        </div>

        {/* Catálogo de Produtos */}
        <main className="flex-1">
          <ProductCatalog products={products} onAddToCart={handleAddToCart} />
        </main>

        {/* Drawer do Carrinho */}
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          tenantSlug={tenant.slug}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          isGift={isGift}
          setIsGift={setIsGift}
          giftMessage={giftMessage}
          setGiftMessage={setGiftMessage}
        />

        {/* Rodapé com Efeito Vidro */}
        <footer className="mt-12 py-6 text-center text-xs text-slate-400 border-t border-white/60 bg-white/40 backdrop-blur-md">
          <p className="flex items-center justify-center gap-1 font-medium">
            Desenvolvido com <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" /> por {tenant.companyName} &copy; 2026
          </p>
        </footer>
      </div>
    </BrandingProvider>
  );
}
