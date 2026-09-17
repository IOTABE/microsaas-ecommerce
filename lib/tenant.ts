import { TenantData } from './types';

// Dados simulados de demonstração para rodar sem dependência obrigatória de BD no primeiro boot
export const DEMO_TENANTS: Record<string, TenantData> = {
  'demo-loja': {
    id: '11111111-1111-1111-1111-111111111111',
    slug: 'demo-loja',
    companyName: 'Boutique & Presentes Elegance',
    branding: {
      primaryColor: '#e11d48',    // Rose-600
      secondaryColor: '#881337',  // Rose-900
      backgroundColor: '#fff1f2',// Rose-50
      logoUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=120&h=120&fit=crop&crop=faces',
      deliveryFeeBelowThreshold: 15.00,
    }
  },
  'tech-store': {
    id: '22222222-2222-2222-2222-222222222222',
    slug: 'tech-store',
    companyName: 'TechExpress Eletrônicos',
    branding: {
      primaryColor: '#2563eb',    // Blue-600
      secondaryColor: '#1e3a8a',  // Blue-900
      backgroundColor: '#eff6ff',// Blue-50
      logoUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=120&h=120&fit=crop',
      deliveryFeeBelowThreshold: 18.00,
    }
  }
};

export const DEMO_PRODUCTS = [
  {
    id: 'p1',
    sku: 'PRES-001',
    title: 'Kit Caneca Térmica & Café Especial Gourmet',
    description: 'Kit especial pronto para presentear, incluindo embalagem premium e cartão.',
    price: 89.90,
    stockQuantity: 25,
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&h=400&fit=crop',
    isFeatured: true
  },
  {
    id: 'p2',
    sku: 'PRES-002',
    title: 'Vela Aromática Artesanal Lavanda Francesa',
    description: 'Vela aromática em vidro âmbar com cera vegetal de coco e pavio de algodão.',
    price: 49.90,
    stockQuantity: 40,
    imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=500&h=400&fit=crop',
    isFeatured: true
  },
  {
    id: 'p3',
    sku: 'PRES-003',
    title: 'Planner Anual Capa Dura em Couro Ecológico',
    description: 'Organização diária e semanal com acabamento requintado.',
    price: 69.90,
    stockQuantity: 15,
    imageUrl: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=500&h=400&fit=crop',
    isFeatured: false
  },
  {
    id: 'p4',
    sku: 'PRES-004',
    title: 'Kit Degustação de Chocolates Finos 70%',
    description: 'Seleção dos melhores grãos de cacau com embalagem presenteável.',
    price: 95.00,
    stockQuantity: 18,
    imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&h=400&fit=crop',
    isFeatured: true
  }
];

export const DEMO_CUSTOMERS = [
  {
    id: 'c1',
    fullName: 'Beatriz Vasconcelos',
    documentCpfCnpj: '123.456.789-00',
    email: 'beatriz@email.com',
    phone: '(11) 99876-1122',
    city: 'São Paulo',
    state: 'SP',
    birthDate: '1992-04-18',
    totalOrders: 3,
  },
  {
    id: 'c2',
    fullName: 'Rodrigo Mendonça',
    documentCpfCnpj: '987.654.321-99',
    email: 'rodrigo@email.com',
    phone: '(21) 98765-4321',
    city: 'Rio de Janeiro',
    state: 'RJ',
    birthDate: '1988-11-02',
    totalOrders: 1,
  },
];

export function getTenantBySlug(slug: string): TenantData {
  return (
    DEMO_TENANTS[slug] || {
      id: 'default-tenant',
      slug,
      companyName: `Loja ${slug.toUpperCase()}`,
      branding: {
        primaryColor: '#0284c7',
        secondaryColor: '#0f172a',
        backgroundColor: '#f8fafc',
        logoUrl: null,
        deliveryFeeBelowThreshold: 15.00,
      }
    }
  );
}
