# Componente de IA - Ranqueador Inteligente de Produtos

## Paradigma

O ranqueador usa regras heurísticas com aprendizado implícito fraco. Ele não usa rede neural nem modelo estatístico; observa cliques do usuário e reordena produtos por relevância dentro da sessão atual.

As preferências ficam no `sessionStorage`:

```typescript
interface Preferencias {
  categorias: Record<string, number>;
  produtosClicados: string[];
  sessaoId: string;
}
```

## Arquivos

- `services/productRanker.ts`: funções de sessão, registro de cliques, score e ordenação.
- `features/catalog/PersonalizedCatalog.tsx`: UI do catálogo, filtros, toggle de relevância e painel de depuração.
- `data/products.ts`: catálogo estático.

## Score

```text
score = 0
categoria entre as 2 mais clicadas  -> +3
categoria já clicada                -> +2, se ainda não ganhou +3
produto já clicado                  -> +1
cliques extras na categoria         -> +0,5 cada, máximo +2
```

Cada produto ranqueado recebe `{ produto, score, motivo }`. O motivo aparece como tooltip/badge no catálogo em modo de relevância.

## Trade-offs

Vantagens: privado, local, rápido, simples e explicável.

Limitações: as preferências somem ao fechar a aba, as regras são fixas e não existe personalização entre dispositivos ou sessões.

Para produção, o próximo passo seria persistir preferências em backend, adicionar sinais explícitos de feedback e testar algoritmos de recomendação mais robustos.
