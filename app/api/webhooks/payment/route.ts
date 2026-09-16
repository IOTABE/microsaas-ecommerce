import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    // Mercado Pago envia id e topic/action
    const externalId = payload.data?.id || payload.id;
    const action = payload.action || payload.type;

    console.log(`[Payment Webhook] Notificação recebida: External ID: ${externalId}, Ação: ${action}`);

    if (!externalId) {
      return NextResponse.json({ received: true, ignored: true });
    }

    try {
      // Localiza a transação correspondente
      const transaction = await prisma.paymentTransaction.findFirst({
        where: { externalId: String(externalId) },
        include: { order: true },
      });

      if (transaction) {
        // Atualiza transação para pago
        await prisma.paymentTransaction.update({
          where: { id: transaction.id },
          data: {
            status: 'paid',
            paidAt: new Date(),
          },
        });

        // Atualiza pedido para confirmação de pagamento e início do pós-venda
        await prisma.order.update({
          where: { id: transaction.orderId },
          data: { status: 'payment_confirmed' },
        });

        // Registra log do pós-venda
        await prisma.postSaleLog.create({
          data: {
            tenantId: transaction.tenantId,
            orderId: transaction.orderId,
            stage: 'em_separacao',
            notes: 'Pagamento confirmado automaticamente via Webhook. Pedido liberado para separação.',
          },
        });

        console.log(`[Payment Webhook] Pedido ${transaction.order.orderNumber} atualizado para PAGO!`);
      }
    } catch (dbError) {
      console.warn('DB não atualizado (modo mock):', dbError);
    }

    return NextResponse.json({ received: true, status: 'processed' });
  } catch (err: any) {
    console.error('Erro no webhook de pagamento:', err);
    return NextResponse.json({ error: 'Erro interno no processamento do webhook' }, { status: 500 });
  }
}
