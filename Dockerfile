# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# MicroSaaS E-commerce — imagem de produção (Next.js standalone + Prisma)
# O banco de dados NÃO roda neste container: aponte DATABASE_URL para o
# PostgreSQL da máquina host (localhost / host.docker.internal).
# ---------------------------------------------------------------------------

FROM node:22-bookworm-slim AS base
ENV NEXT_TELEMETRY_DISABLED=1
# OpenSSL é exigido pelos engines do Prisma
RUN apt-get update -y \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# ------------------------------ deps ---------------------------------------
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ------------------------------ build --------------------------------------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# ------------------------------ runtime ------------------------------------
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
WORKDIR /app

RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs

# App standalone gerado pelo Next
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Prisma Client + engine (necessários em runtime)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma

RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
