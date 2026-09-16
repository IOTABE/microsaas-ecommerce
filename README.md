# Micro SaaS Multitenant - E-commerce, CRM & Omnichannel Marketing

Plataforma completa de Micro SaaS desenvolvida em **Next.js 14 (App Router) + TypeScript + Tailwind CSS + Prisma ORM**, com isolamento multitenant, vitrines com branding dinâmico, captura simplificada de leads, catálogo de produtos, checkout integrado com regras de frete e opção de presente, esteira de pós-vendas e disparos promocionais para WhatsApp e E-mail.

---

## 🚀 Funcionalidades Implementadas

1. **Arquitetura Multitenant & Whitelabel**:
   - Isolamento lógico de dados por `tenant_id` e suporte a Row-Level Security (RLS) no PostgreSQL.
   - Vitrines personalizadas (`/[tenantSlug]`) com injeção dinâmica de CSS variables (`--primary-color`, `--secondary-color`, `--bg-color`).
   - Configuração de logo e gestão de senhas com algoritmo seguro (`/admin/branding`).

2. **Receptor de Leads na Tela Principal (Home)**:
   - Widget de conversão na vitrine capturando apenas **Nome** e **WhatsApp** com validação e consentimento LGPD (`components/LeadWidget.tsx`).
   - Deduplicação automática por telefone por tenant.

3. **Cadastro Completo de Clientes**:
   - Coleta de dados completos no Checkout e CRM: Nome completo, CPF/CNPJ, E-mail, Celular e Endereço completo com busca por CEP via BrasilAPI.

4. **Catálogo e Gestão de Produtos**:
   - Cadastro de produtos com SKU, título, descrição, preço, estoque, imagens e flag de destaque (`/admin/products`).

5. **Carrinho, Checkout & Regras de Frete**:
   - **Regra dos R$ 150,00**: Pedidos abaixo de R$ 150,00 aplicam taxa de entrega; pedidos a partir de R$ 150,00 recebem **Frete Grátis** automaticamente (`lib/shipping.ts`).
   - **Opção de Presente**: Checkbox *"É para presente?"* com campo expansível para dedicatória no cartão (até 250 caracteres).
   - **Integração de Pagamento**: Conexão com gateway (Mercado Pago) gerando cobranças com QR Code PIX e código Copia e Cola instantâneo (`lib/payment-gateway.ts`).

6. **Esteira de Pós-Vendas**:
   - Kanban/lista de expedição destacando pedidos que necessitam de embalagem de presente e cartão (`/admin/orders`).
   - Atualização de status do pedido e inclusão de código de rastreio dos Correios/transportadora.
   - Disparo de pesquisa de satisfação pós-entrega (NPS).

7. **Alertas Promocionais Omnichannel (E-mail & WhatsApp)**:
   - Disparo segmentado para Leads da Home ou Clientes compradores (`/admin/campaigns`).
   - Suporte a tags dinâmicas (`{{nome}}`, `{{cupom}}`) e fila assíncrona.

---

## 📂 Estrutura de Pastas

```
microsaas-ecommerce/
├── app/
│   ├── [tenantSlug]/            # Vitrine pública dinâmica por tenant
│   │   ├── page.tsx             # Home: Branding, Lead Widget, Catálogo, Carrinho
│   │   └── checkout/page.tsx    # Checkout com dados completos, presente e PIX
│   ├── admin/                   # Painel Administrativo do Lojista
│   │   ├── page.tsx             # Dashboard geral de métricas
│   │   ├── branding/page.tsx    # Cores, Logo, Taxa de Frete e Troca de Senha
│   │   ├── products/page.tsx    # Cadastro de produtos e estoque
│   │   ├── orders/page.tsx      # Vendas, esteira de pós-venda e presente
│   │   ├── customers/page.tsx   # Gestão de Leads da home e Clientes
│   │   └── campaigns/page.tsx   # Disparo de alertas (E-mail e WhatsApp)
│   ├── api/                     # Endpoints da API REST
│   │   ├── leads/route.ts       # Captura de leads
│   │   ├── checkout/route.ts    # Fechamento de venda e pagamento
│   │   ├── webhooks/payment/    # Confirmação de pagamentos
│   │   └── campaigns/dispatch/  # Disparo de campanhas
│   ├── layout.tsx
│   └── globals.css
├── components/                  # Componentes reutilizáveis (LeadWidget, CartDrawer, etc.)
├── lib/                         # Regras de negócio (shipping, payment, tenant, prisma)
├── prisma/                      # Schema do banco de dados multitenant
└── package.json
```

---

## 🛠️ Como Executar o Projeto

```bash
# 1. Acesse o diretório do projeto
cd /home/gti/.gemini/antigravity/scratch/microsaas-ecommerce

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse:
- Vitrine de exemplo 1: `http://localhost:3000/demo-loja`
- Vitrine de exemplo 2: `http://localhost:3000/tech-store`
- Painel Administrativo: `http://localhost:3000/admin`
