/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Gera um servidor mínimo em .next/standalone para imagens Docker enxutas
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' }
    ]
  },
  // Garante que os engines/binários do Prisma entrem no bundle standalone
  outputFileTracingIncludes: {
    '/api/**': ['./node_modules/.prisma/client/**/*', './node_modules/@prisma/client/**/*']
  }
};

module.exports = nextConfig;
