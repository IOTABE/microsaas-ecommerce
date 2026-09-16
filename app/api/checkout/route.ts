import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateShipping } from '@/lib/shipping';
import { processOrderPayment } from '@/lib/payment-gateway';
import { z } from 'zod';

const checkoutSchema = z.object({
  tenantSlug: z.string(),
  customer: z.object({
    fullName: z.string().min(3),
    documentCpfCnpj: z.string().min(11),
    email: z.string().email(),
    phone: z.string().min(10),
    address: z.object({
      zipCode: z.string().min(8),
      street: z.string().min(2),
      number: z.string(),
      complement: z.string().optional(),
      neighborhood: z.string().min(2),
      city: z.string().min(2),
      state: z.string().length(2),
    }),
  }),
  items: z.array(
    z.object({
      productId: z.string(),
      sku: z.string(),
      title: z.string(),
      price: z.number().positive(),
      quantity: z.number().int().positive(),
    })
  ).min(1),
  isGift: z.boolean(),
  giftMessage: z.string().max(250).optional(),
  paymentMethod: z.enum(['pix', 'credit_card']),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = checkoutSchema.parse(body);

    // 1. Recalcula Subtotal e Frete no servidor com base na regra de R$ 150
    const subtotal = data.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = calculateShipping(subtotal);

    const generatedOrderNumber = Math.floor(100000 + Math.random() * 900000);
    const orderId = `ord_${Date.now()}`;

    // 2. Tenta persistência completa no banco se conectado
    try {
      const tenant = await prisma.tenant.findUnique({
        where: { slug: data.tenantSlug },
      });

      if (tenant) {
        // Upsert do cliente completo
        const customer = await prisma.customer.upsert({
          where: {
            uq_customers_tenant_doc: {
              tenantId: tenant.id,
              documentCpfCnpj: data.customer.documentCpfCnpj,
            },
          },
          update: {
            fullName: data.customer.fullName,
            phone: data.customer.phone,
            email: data.customer.email,
          },
          create: {
            tenantId: tenant.id,
            fullName: data.customer.fullName,
            documentCpfCnpj: data.customer.documentCpfCnpj,
            phone: data.customer.phone,
            email: data.customer.email,
          },
        });

        // Gravação do endereço
        await prisma.customerAddress.create({
          data: {
            tenantId: tenant.id,
            customerId: customer.id,
            zipCode: data.customer.address.zipCode,
            street: data.customer.address.street,
            number: data.customer.address.number,
            complement: data.customer.address.complement,
            neighborhood: data.customer.address.neighborhood,
            city: data.customer.address.city,
            state: data.customer.address.state,
            isDefault: true,
          },
        });

        // Criação do Pedido
        const order = await prisma.order.create({
          data: {
            tenantId: tenant.id,
            customerId: customer.id,
            subtotal: subtotal,
            shippingFee: shipping.shippingFee,
            totalAmount: shipping.total,
            isGift: data.isGift,
            giftMessage: data.isGift ? data.giftMessage : null,
            status: 'pending_payment',
            items: {
              create: data.items.map((item) => ({
                tenantId: tenant.id,
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: item.price,
                totalPrice: item.price * item.quantity,
              })),
            },
            postSaleLogs: {
              create: {
                tenantId: tenant.id,
                stage: 'aguardando_pagamento',
                notes: data.isGift
                  ? `Pedido com embalagem especial para presente. Dedicatória: ${data.giftMessage || 'Nenhuma'}`
                  : 'Pedido padrão recebido.',
              },
            },
          },
        });

        // 3. Processamento de Pagamento no Gateway
        const payment = await processOrderPayment({
          orderId: order.id,
          orderNumber: order.orderNumber.toString(),
          amount: shipping.total,
          customer: {
            fullName: data.customer.fullName,
            email: data.customer.email,
            documentCpfCnpj: data.customer.documentCpfCnpj,
          },
          paymentMethod: data.paymentMethod,
        });

        // Registra transação
        await prisma.paymentTransaction.create({
          data: {
            tenantId: tenant.id,
            orderId: order.id,
            gatewayProvider: payment.gateway,
            externalId: payment.externalTransactionId,
            paymentMethod: data.paymentMethod,
            status: payment.status,
            amount: shipping.total,
            pixQrCode: payment.pixQrCode,
            pixCopyPaste: payment.pixCopyPaste,
          },
        });

        return NextResponse.json({
          success: true,
          order: {
            id: order.id,
            orderNumber: order.orderNumber.toString(),
            totalAmount: shipping.total,
            shippingFee: shipping.shippingFee,
            isGift: data.isGift,
            giftMessage: data.giftMessage,
          },
          payment,
        });
      }
    } catch (dbError) {
      console.warn('Banco de dados indisponível, operando no modo desenvolvimento/mock:', dbError);
    }

    // Processamento com fallback de pagamento
    const payment = await processOrderPayment({
      orderId,
      orderNumber: generatedOrderNumber,
      amount: shipping.total,
      customer: {
        fullName: data.customer.fullName,
        email: data.customer.email,
        documentCpfCnpj: data.customer.documentCpfCnpj,
      },
      paymentMethod: data.paymentMethod,
    });

    return NextResponse.json({
      success: true,
      order: {
        id: orderId,
        orderNumber: generatedOrderNumber,
        totalAmount: shipping.total,
        shippingFee: shipping.shippingFee,
        isGift: data.isGift,
        giftMessage: data.giftMessage,
      },
      payment,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.errors?.[0]?.message || err.message || 'Erro no checkout' },
      { status: 400 }
    );
  }
}
