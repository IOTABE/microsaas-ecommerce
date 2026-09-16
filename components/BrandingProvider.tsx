'use client';

import React, { useEffect } from 'react';
import { TenantData } from '@/lib/types';

interface BrandingProviderProps {
  tenant: TenantData;
  children: React.ReactNode;
}

// Utilitário para gerar tonalidades Material You a partir de uma cor HEX
function hexToRgba(hex: string, alpha: number): string {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map((c) => c + c).join('');
  }
  const num = parseInt(cleanHex, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function BrandingProvider({ tenant, children }: BrandingProviderProps) {
  useEffect(() => {
    if (tenant.branding) {
      const root = document.documentElement;
      const primary = tenant.branding.primaryColor || '#2563eb';
      const secondary = tenant.branding.secondaryColor || '#1e293b';
      const bg = tenant.branding.backgroundColor || '#f8fafc';

      root.style.setProperty('--primary-color', primary);
      root.style.setProperty('--secondary-color', secondary);
      root.style.setProperty('--bg-color', bg);

      // Gera tokens dinâmicos Material You (M3 Tonal Palettes)
      root.style.setProperty('--primary-container', hexToRgba(primary, 0.15));
      root.style.setProperty('--on-primary-container', primary);
      root.style.setProperty('--surface-variant', hexToRgba(secondary, 0.05));
    }
  }, [tenant]);

  return <>{children}</>;
}
