import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Micro SaaS Multitenant E-commerce & CRM',
  description: 'Plataforma SaaS de e-commerce com multitenant, leads, checkout e pós-vendas.',
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
