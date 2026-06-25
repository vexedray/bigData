# Arquitetura — PetRocker 🤘🐾

## Fluxo da aplicação

```
 ┌──────────────┐     clica no card      ┌──────────────────┐
 │  Catálogo    │ ──────────────────────→ │  Ranqueador IA   │
 │  (page.tsx)  │                         │  (sessionStorage)│
 │              │ ←────────────────────── │  reordena grid   │
 └──────┬───────┘     ordena por score    └──────────────────┘
        │
        │ Adicionar ao carrinho
        ▼
 ┌──────────────┐     Finalizar compra    ┌──────────────────┐
 │   Carrinho   │ ──────────────────────→ │  /api/checkout   │
 │ (carrinho/   │                         │  (POST)          │
 │  page.tsx)   │                         └────────┬─────────┘
 └──────────────┘                                  │
                                                   │ retorna { url,
                                                   │   pedidoId, total }
                                                   ▼
                                          ┌──────────────────┐
                                          │ Checkout Simulado │
                                          │ (checkout-simulado│
                                          │  /page.tsx)      │
                                          └────────┬─────────┘
                                                   │ Confirmar e pagar
                                                   │ (1,5s loading)
                                                   ▼
                                          ┌──────────────────┐
                                          │    Obrigado      │
                                          │ (obrigado/       │
                                          │  page.tsx)       │
                                          └──────────────────┘
```

## Onde o componente de IA se encaixa

O **Ranqueador Inteligente** (`lib/ranqueador.ts` + `components/CatalogoPersonalizado.tsx`) atua diretamente na página inicial, interceptando os cliques do usuário nos cards do catálogo. Ele não interfere no fluxo de compra (carrinho → checkout → obrigado), mas influencia a descoberta de produtos ao reordenar o grid conforme as preferências implícitas do usuário.

Quando o usuário ativa o modo "Ver por relevância", o ranqueador calcula scores e reordena o grid. O fluxo de compra permanece inalterado — o ranqueador atua apenas na camada de apresentação do catálogo.

## Lista de rotas

| Rota | Tipo | Descrição |
|------|------|-----------|
| `/` | Estática | Página inicial com catálogo e hero section |
| `/carrinho` | Estática | Carrinho de compras com itens, quantidades e total |
| `/checkout-simulado` | Estática | Formulário de checkout (Nome, E-mail, CPF, pagamento) |
| `/obrigado` | Estática | Confirmação de pedido realizado |
| `POST /api/checkout` | Dinâmica (API) | Gera pedidoId e retorna URL do checkout simulado |
