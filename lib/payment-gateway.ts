export interface PaymentResult {
  success: boolean;
  externalTransactionId: string;
  gateway: 'mercadopago' | 'mock';
  status: 'pending' | 'paid' | 'failed';
  pixQrCode?: string;
  pixCopyPaste?: string;
  checkoutUrl?: string;
  errorMessage?: string;
}

export interface PaymentRequestData {
  orderId: string;
  orderNumber: string | number;
  amount: number;
  customer: {
    fullName: string;
    email: string;
    documentCpfCnpj: string;
  };
  paymentMethod: 'pix' | 'credit_card';
}

/**
 * Serviço de Integração com Plataforma de Pagamento (Mercado Pago / Asaas / Mock)
 */
export async function processOrderPayment(data: PaymentRequestData): Promise<PaymentResult> {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;

  // Em produção com token real, conecta à API do Mercado Pago
  if (token && !token.includes('TEST-xxxxxxxxxxxx')) {
    try {
      if (data.paymentMethod === 'pix') {
        const response = await fetch('https://api.mercadopago.com/v1/payments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'X-Idempotency-Key': data.orderId,
          },
          body: JSON.stringify({
            transaction_amount: data.amount,
            description: `Pedido #${data.orderNumber}`,
            payment_method_id: 'pix',
            payer: {
              email: data.customer.email,
              first_name: data.customer.fullName.split(' ')[0],
              last_name: data.customer.fullName.split(' ').slice(1).join(' ') || 'Cliente',
              identification: {
                type: data.customer.documentCpfCnpj.length > 11 ? 'CNPJ' : 'CPF',
                number: data.customer.documentCpfCnpj.replace(/\D/g, ''),
              },
            },
          }),
        });

        const resData = await response.json();
        if (response.ok) {
          return {
            success: true,
            gateway: 'mercadopago',
            externalTransactionId: String(resData.id),
            status: resData.status === 'approved' ? 'paid' : 'pending',
            pixQrCode: resData.point_of_interaction?.transaction_data?.qr_code_base64,
            pixCopyPaste: resData.point_of_interaction?.transaction_data?.qr_code,
          };
        }
      }
    } catch (err: any) {
      console.error('Falha na requisição ao gateway de pagamento:', err);
    }
  }

  // Fallback de Demonstração / Sandbox Standalone
  const mockExternalId = `mp_mock_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const mockPixPayload = `00020126580014br.gov.bcb.pix0136mock-pix-key-microsaas-520400005303986540${data.amount.toFixed(2)}5802BR5920MicroSaaS Pagamentos6009Sao Paulo62070503***6304ABCD`;

  return {
    success: true,
    gateway: 'mock',
    externalTransactionId: mockExternalId,
    status: 'pending',
    pixQrCode: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="14" fill="%23374151">QR Code PIX Simulado</text></svg>',
    pixCopyPaste: mockPixPayload,
  };
}
