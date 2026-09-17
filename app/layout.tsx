import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MicroSaaS E-commerce — Sua loja online em 2 minutos',
  description:
    'Plataforma completa de e-commerce SaaS com CRM, captura de leads, checkout com PIX, campanhas de WhatsApp e painel administrativo. Sem contrato, cancele quando quiser.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
