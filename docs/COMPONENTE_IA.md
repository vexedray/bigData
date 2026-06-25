# Componente de IA — Ranqueador Inteligente de Produtos

## Paradigma e representação do conhecimento

**Paradigma:** Sistemas baseados em regras (expert system) com aprendizado implícito fraco.

O ranqueador não utiliza redes neurais nem aprendizado de máquina estatístico. Em vez disso, emprega um conjunto de regras heurísticas pré-definidas que mapeiam o comportamento do usuário (cliques em cards) para um score de relevância. A representação do conhecimento é feita por meio de um mapa de preferências armazenado no `sessionStorage` do navegador:

```typescript
interface Preferencias {
  categorias: Record<string, number>;    // contagem de cliques por categoria
  produtosClicados: string[];            // até 10 IDs de produtos clicados (FIFO)
  sessaoId: string;                      // identificador único da sessão
}
```

## Como funciona tecnicamente

### Arquivos envolvidos

- **`lib/ranqueador.ts`** — Núcleo da lógica: funções puras de registro, cálculo de score e ordenação.
- **`components/CatalogoPersonalizado.tsx`** — Componente React que consome o ranqueador e orquestra a UI (toggle, badges, painel de depuração).
- **`lib/produtos.ts`** — Base de dados do catálogo (16 produtos em 4 categorias).

### Funções principais (`ranqueador.ts`)

| Função | Papel |
|--------|-------|
| `iniciarSessao()` | Cria estrutura de preferências vazia com ID aleatório |
| `carregarPreferencias()` | Lê do `sessionStorage["prefs"]` ou cria nova |
| `salvarPreferencias(prefs)` | Persiste no `sessionStorage` |
| `registrarClique(id, categoria)` | Incrementa contagem da categoria e adiciona produto ao topo da lista (máx 10) |
| `calcularScore(produto, prefs)` | Aplica heurísticas e retorna `{ score, motivo }` |
| `ranquear(produtos, prefs)` | Ordena todos os produtos pelo score (desempate por nome) |

### Algoritmo de score (`calcularScore`)

```
score = 0
SE categoria está entre as 2 mais clicadas  →  +3
SE categoria foi clicada ao menos 1 vez      →  +2  (se já não ganhou +3)
SE produto já foi clicado                    →  +1
PARA cada clique extra na categoria (além do 1º):
    +0,5 (máximo +2)
```

O motivo (ex: "categoria entre as top 2 (+3); produto já clicado (+1)") é armazenado junto ao score e exibido como tooltip nos badges do catálogo.

## Trade-offs desta abordagem

### Vantagens

- **Privacidade total:** os dados nunca saem do navegador (nenhuma requisição externa).
- **Zero latência:** o cálculo é feito localmente em O(n), sem chamadas de rede.
- **Simplicidade:** não requer API key, servidor de ML ou infraestrutura adicional.
- **Transparência:** cada score é explicado por um motivo textual visível ao usuário.

### Desvantagens

- **Sessão limitada:** os dados são perdidos ao fechar a aba (sessionStorage). Não há personalização entre visitas.
- **Heurísticas fixas:** as regras de score são estáticas e não aprendem com o tempo; um usuário que muda de interesse leva algumas interações para o ranking se adaptar.
- **Sem cross-session:** não há identificação do usuário entre sessões; cada visita começa do zero.
- **Escopo limitado:** funciona apenas para um único catálogo; não generaliza para outros contextos.

## O que seria necessário para uma versão de produção

1. **Backend de preferências:** substituir o `sessionStorage` por um banco de dados (ex: PostgreSQL + Redis) vinculado a um userId, permitindo personalização persistente entre sessões e dispositivos.
2. **Algoritmo mais sofisticado:** evoluir de regras fixas para um modelo de filtragem colaborativa (ex: ALS, Matrix Factorization) ou um sistema de recomendação baseado em embeddings (ex: Word2Vec para sequências de cliques).
3. **Coleta de feedback explícito:** adicionar avaliações (like/dislike) para refinar o modelo com sinais diretos do usuário.
4. **Testes A/B:** implementar experimentos para comparar diferentes estratégias de ranqueamento e medir impacto em conversão.
5. **Feature store:** centralizar features como horário do clique, dispositivo, localização geográfica e histórico de compras para enriquecer o modelo.
6. **Infraestrutura:** pipeline de treinamento periódico (ex: Apache Airflow + Spark), API de inferência com cache (Redis) e monitoramento de métricas (precisão, recall, receita gerada).
