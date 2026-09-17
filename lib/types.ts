export interface TenantData {
  id: string;
  slug: string;
  companyName: string;
  branding?: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    logoUrl: string | null;
    deliveryFeeBelowThreshold: number;
  };
}

export interface CartItem {
  productId: string;
  sku: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl?: string | null;
}

export interface CheckoutPayload {
  tenantSlug: string;
  customer: {
    fullName: string;
    documentCpfCnpj: string;
    email: string;
    phone: string;
    address: {
      zipCode: string;
      street: string;
      number: string;
      complement?: string;
      neighborhood: string;
      city: string;
      state: string;
    };
  };
  items: CartItem[];
  isGift: boolean;
  giftMessage?: string;
  paymentMethod: 'pix' | 'credit_card';
}

export interface LeadInput {
  tenantSlug: string;
  name: string;
  whatsapp: string;
  birthDate?: string;
  source?: string;
  consentLgpd: boolean;
}

export interface ProductData {
  id: string;
  sku: string;
  title: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string | null;
  isFeatured: boolean;
}

export interface ProductInput {
  tenantSlug?: string;
  sku: string;
  title: string;
  description?: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string | null;
  isFeatured?: boolean;
}

export interface CustomerData {
  id: string;
  fullName: string;
  documentCpfCnpj: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  birthDate: string | null;
  totalOrders: number;
}

export interface CustomerInput {
  tenantSlug?: string;
  fullName: string;
  documentCpfCnpj: string;
  email: string;
  phone: string;
  city?: string;
  state?: string;
  birthDate?: string | null;
}
