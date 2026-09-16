export const FREE_SHIPPING_THRESHOLD = 150.0;
export const DEFAULT_DELIVERY_FEE = 15.0;

export interface ShippingCalculation {
  subtotal: number;
  shippingFee: number;
  isFreeShipping: boolean;
  remainingForFreeShipping: number;
  total: number;
}

/**
 * Calcula a taxa de entrega baseada na regra:
 * - Pedidos abaixo de R$ 150,00 possuem taxa de entrega.
 * - Pedidos a partir de R$ 150,00 possuem Frete Grátis (R$ 0,00).
 */
export function calculateShipping(
  subtotal: number,
  deliveryFee: number = DEFAULT_DELIVERY_FEE
): ShippingCalculation {
  const isFree = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingFee = isFree ? 0.0 : deliveryFee;
  const remaining = isFree ? 0.0 : Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const total = subtotal + shippingFee;

  return {
    subtotal,
    shippingFee,
    isFreeShipping: isFree,
    remainingForFreeShipping: Number(remaining.toFixed(2)),
    total: Number(total.toFixed(2)),
  };
}
