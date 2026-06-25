# PetRocker 🤘🐾

Pet shop temático de rock especializado em pet rocks (pedras de estimação) e acessórios rock'n'roll. Oferecemos uma experiência personalizada com ranqueamento inteligente de produtos baseado nas preferências do usuário.

---

## Como rodar localmente

1. `git clone <url-do-repositorio>`
2. `cd bigdata`
3. `npm install`
4. `cp .env.example .env.local` (e preencher as variáveis)
5. `npm run dev`
6. Abrir [http://localhost:3000](http://localhost:3000)

---

## Variáveis de ambiente

| Nome | Descrição | Exemplo |
|------|-----------|---------|
| `NEXT_PUBLIC_APP_NAME` | Nome público da aplicação | `PetRocker` |
| `INFINITEPAY_HANDLE` | Identificador da conta InfinitePay (comentado — opcional) | `seu_handle_aqui` |

---

## Componente de IA

**Ranqueador Inteligente de Produtos**

- **Paradigma:** Baseado em regras com feedback implícito do usuário.
- **Representação do conhecimento:** Mapa de preferências armazenado no `sessionStorage` do navegador, contendo contagens de cliques por categoria e histórico de produtos clicados.
- **Funcionamento:** A cada interação do usuário com um card do catálogo, o sistema registra a categoria e o produto. Ao ativar o modo "Ver por relevância", um algoritmo de score calcula a afinidade de cada produto com base nas categorias mais clicadas (+3 para top 2, +2 para categoria clicada, +1 para produto revisitado, +0,5 por clique extra). Os produtos são reordenados do maior para o menor score, com desempate por ordem alfabética.
- **Persistência:** Os dados permanecem apenas durante a sessão do navegador (sessionStorage), sem envio para servidor.

---

## Estrutura de pastas

```
bigdata/
├── app/
│   ├── api/
│   │   └── checkout/route.ts    — Rota POST que cria checkout na InfinitePay (ou fallback simulado)
│   ├── carrinho/page.tsx        — Página do carrinho de compras
│   ├── checkout-simulado/page.tsx — Formulário de checkout simulado
│   ├── obrigado/page.tsx        — Página de confirmação pós-compra
│   ├── globals.css              — Estilos globais Tailwind
│   ├── layout.tsx               — Layout raiz (CartProvider + Header)
│   └── page.tsx                 — Página inicial com catálogo
├── components/
│   ├── CatalogoPersonalizado.tsx — Catálogo com toggle de ranqueamento
│   └── Header.tsx               — Header fixo com ícone do carrinho
├── lib/
│   ├── cart-context.tsx         — Contexto do carrinho (Provider + useCart)
│   ├── produtos.ts              — Array com 16 produtos do catálogo
│   └── ranqueador.ts            — Lógica de ranqueamento inteligente
├── types/
│   └── index.ts                 — Interface Produto
├── docs/
│   ├── ARQUITETURA.md           — Documentação da arquitetura
│   └── COMPONENTE_IA.md         — Detalhamento do componente de IA
├── .env.example                 — Exemplo de variáveis de ambiente
├── .gitignore                   — Arquivos ignorados pelo git
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## Integrantes

- Nome1
- Nome2
- Nome3
- Nome4

---

## Créditos

**Disciplina de Big Data, Analytics e IA — SENAI SC — Prof. Filipe Ribeiro da Cas**
