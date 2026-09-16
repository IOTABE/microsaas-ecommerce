'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getTenantBySlug, DEMO_PRODUCTS } from '@/lib/tenant';
import { BrandingProvider } from '@/components/BrandingProvider';
import { Navbar } from '@/components/Navbar';
import { LeadWidget } from '@/components/LeadWidget';
import { ProductCatalog } from '@/components/ProductCatalog';
import { CartDrawer } from '@/components/CartDrawer';
import { CartItem } from '@/lib/types';
import { Sparkles, Heart } from 'lucide-react';

export default function TenantStorefrontPage() {
  const params = useParams();
  const tenantSlug = typeof params.tenantSlug === 'string' ? params.tenantSlug : 'demo-loja';
  const tenant = getTenantBySlug(tenantSlug);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isGift, setIsGift] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');

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
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar
          tenant={tenant}
          cartCount={totalItemsCount}
          onOpenCart={() => setIsCartOpen(true)}
        />

        {/* Hero Banner Personalizado */}
        <section
          className="py-12 px-4 text-center border-b border-gray-100"
          style={{ backgroundColor: 'var(--bg-color, #ffffff)' }}
        >
          <div className="max-w-3xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-white shadow-sm border border-gray-200">
              <Sparkles className="w-3.5 h-3.5 text-tenant-primary" /> Bem-vindo à nossa loja oficial
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              {tenant.companyName}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 max-w-lg mx-auto">
              Produtos selecionados com carinho. Frete grátis para compras acima de R$ 150,00 e
              embalagem especial para presente!
            </p>
          </div>
        </section>

        {/* Receptor de Leads na Tela Principal */}
        <div className="px-4">
          <LeadWidget tenantSlug={tenant.slug} />
        </div>

        {/* Grade de Produtos */}
        <main className="flex-1">
          <ProductCatalog products={DEMO_PRODUCTS} onAddToCart={handleAddToCart} />
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

        {/* Rodapé */}
        <footer className="bg-white border-t border-gray-200 py-6 text-center text-xs text-gray-400">
          <p className="flex items-center justify-center gap-1">
            Feito com <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" /> por {tenant.companyName} &copy; 2026
          </p>
        </footer>
      </div>
    </BrandingProvider>
  );
}
