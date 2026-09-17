import type { PrismaClient } from '@prisma/client';

/**
 * Retorna o PrismaClient se o banco estiver configurado e acessível.
 * Caso contrário retorna null para que as rotas usem o fallback em memória
 * (modo demonstração).
 */
export async function getPrisma(): Promise<PrismaClient | null> {
  try {
    const { prisma } = await import('@/lib/prisma');
    return prisma;
  } catch {
    return null;
  }
}
