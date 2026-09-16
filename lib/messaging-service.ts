export interface SendPromotionParams {
  tenantSlug: string;
  channel: 'email' | 'whatsapp' | 'both';
  recipients: Array<{
    name: string;
    destination: string; // email ou telefone com DDD
    type: 'lead' | 'customer';
  }>;
  subject?: string;
  contentText: string;
  couponCode?: string;
}

export interface DispatchResult {
  total: number;
  queued: number;
  channel: string;
  sampleMessage: string;
}

/**
 * Serviço de Envio de Alertas e Promoções (Omnichannel: E-mail e WhatsApp)
 */
export async function dispatchPromotionalCampaign(
  params: SendPromotionParams
): Promise<DispatchResult> {
  const { channel, recipients, contentText, couponCode } = params;

  // Processamento e personalização de tags dinâmicas
  const sampleMessage = contentText
    .replace('{{nome}}', recipients[0]?.name || 'Cliente')
    .replace('{{cupom}}', couponCode ? `Use o cupom: ${couponCode}` : '');

  // Simulação de enfileiramento assíncrono (Redis/BullMQ) com logs
  console.log(`[Campaign Dispatcher] Iniciando envio para ${recipients.length} contatos via ${channel.toUpperCase()}`);
  
  for (const recipient of recipients.slice(0, 3)) {
    if (channel === 'whatsapp' || channel === 'both') {
      console.log(`[WhatsApp -> ${recipient.destination}]: Olá ${recipient.name}! ${sampleMessage}`);
    }
    if (channel === 'email' || channel === 'both') {
      console.log(`[E-mail -> ${recipient.destination}]: Assunto: ${params.subject || 'Promoção Exclusiva'} | Conteúdo: ${sampleMessage}`);
    }
  }

  return {
    total: recipients.length,
    queued: recipients.length,
    channel,
    sampleMessage,
  };
}
