import type { Metadata, Viewport } from 'next';
import { PwaInstallPrompt } from '@/components/PwaInstallPrompt';
import './globals.css';

export const metadata: Metadata = {
  title: 'MicroSaaS E-commerce — Sua loja online em 2 minutos',
  description:
    'Plataforma completa de e-commerce SaaS com CRM, captura de leads, checkout com PIX, campanhas de WhatsApp e painel administrativo. Sem contrato, cancele quando quiser.',
  applicationName: 'MicroSaaS',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'MicroSaaS',
    statusBarStyle: 'black-translucent',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen flex flex-col">
        {children}
        <PwaInstallPrompt />
      </body>
    </html>
  );
}
