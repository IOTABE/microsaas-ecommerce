import type { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Cria o PrismaClient de forma preguiçosa e tolerante a falhas.
 *
 * Se o client não tiver sido gerado (`npx prisma generate`) ou o pacote
 * estiver indisponível, devolvemos um Proxy que lança apenas quando o banco
 * é realmente acessado. Assim as rotas conseguem capturar o erro e cair no
 * fallback em memória, em vez de derrubar o módulo inteiro com um 500 vazio.
 */
function createPrismaClient(): PrismaClient {
  try {
    // Import em runtime: um `import` estático quebraria o módulo antes do try/catch.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const prismaModule = require('@prisma/client');
    const PrismaClientCtor = prismaModule?.PrismaClient;

    if (typeof PrismaClientCtor !== 'function') {
      throw new Error('PrismaClient não exportado pelo @prisma/client');
    }

    const client = new PrismaClientCtor({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    }) as PrismaClient;

    if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = client;
    return client;
  } catch (error) {
    console.warn(
      '[prisma] Client indisponível — operando em modo demonstração (fallback em memória).',
      error instanceof Error ? error.message : error
    );

    return new Proxy({} as PrismaClient, {
      get() {
        throw new Error(
          'Banco de dados indisponível. Execute `npx prisma generate` e configure DATABASE_URL.'
        );
      },
    });
  }
}

export const prisma: PrismaClient = globalForPrisma.prisma ?? createPrismaClient();
