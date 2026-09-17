import { DEMO_CUSTOMERS, DEMO_PRODUCTS } from './tenant';
import type { CustomerData, LeadRecord, ProductData } from './types';

interface DemoStore {
  products: ProductData[];
  customers: CustomerData[];
  leads: LeadRecord[];
}

/**
 * Store em memória usado como fallback quando o PostgreSQL não está acessível.
 * Fica no globalThis para sobreviver ao hot-reload do Next em desenvolvimento.
 */
const globalForStore = globalThis as unknown as { __demoStore?: DemoStore };

export function getStore(): DemoStore {
  if (!globalForStore.__demoStore) {
    globalForStore.__demoStore = {
      products: DEMO_PRODUCTS.map((p) => ({ ...p })),
      customers: DEMO_CUSTOMERS.map((c) => ({ ...c })),
      leads: [],
    };
  }

  // Backfill de campos adicionados depois que o global já estava criado
  // (o store sobrevive ao hot-reload em desenvolvimento).
  if (!Array.isArray(globalForStore.__demoStore.leads)) {
    globalForStore.__demoStore.leads = [];
  }

  return globalForStore.__demoStore;
}
