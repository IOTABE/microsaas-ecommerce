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
  source?: string;
  consentLgpd: boolean;
}
