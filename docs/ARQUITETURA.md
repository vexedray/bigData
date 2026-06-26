# Arquitetura - PetRocker 🤘🐾

O projeto usa o App Router do Next.js, mas mantém os arquivos de rota pequenos. A lógica visual e de domínio fica em módulos nomeados fora de `app`.

## Estrutura

```text
app/
  api/checkout/route.ts
  carrinho/page.tsx
  checkout-simulado/page.tsx
  produtos/[id]/page.tsx
  page.tsx
components/
  layout/Header.tsx
contexts/
  CartContext.tsx
data/
  products.ts
features/
  cart/CartPage.tsx
  catalog/PersonalizedCatalog.tsx
  checkout/SimulatedCheckoutPage.tsx
  home/HomePage.tsx
  products/ProductDetailsPage.tsx
services/
  productRanker.ts
types/
  index.ts
```

## Regras de organização

- `app`: somente rotas, layout global e endpoints.
- `features`: telas e componentes ligados a uma área funcional.
- `components`: componentes compartilhados entre features.
- `contexts`: estado global de UI/aplicação.
- `data`: dados estáticos e seeds.
- `services`: regras de negócio e funções reutilizáveis.
- `types`: contratos TypeScript compartilhados.

## Fluxo principal

```text
HomePage
  -> PersonalizedCatalog
  -> ProductDetailsPage
  -> CartPage
  -> POST /api/checkout
  -> InfinitePay ou SimulatedCheckoutPage
  -> ThankYouPage
```

## Ranqueador inteligente

O ranqueador fica em `services/productRanker.ts`. Ele grava preferências no `sessionStorage`, calcula scores por categoria/produto clicado e entrega a lista ordenada para `features/catalog/PersonalizedCatalog.tsx`.

O fluxo de compra não depende do ranqueador; ele atua apenas na apresentação do catálogo.

## Rotas

| Rota | Descrição |
|------|-----------|
| `/` | Página inicial com hero, categorias, destaques e catálogo |
| `/produtos/[id]` | Detalhe do produto |
| `/carrinho` | Carrinho de compras |
| `/checkout-simulado` | Checkout local usado quando não há `INFINITEPAY_HANDLE` |
| `/obrigado` | Confirmação de pedido |
| `POST /api/checkout` | Cria pedido e retorna URL de pagamento |
