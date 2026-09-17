import { DEMO_CUSTOMERS, DEMO_PRODUCTS } from './tenant';
import type { CustomerData, ProductData } from './types';

interface DemoStore {
  products: ProductData[];
  customers: CustomerData[];
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
    };
  }
  return globalForStore.__demoStore;
}
