import type { Produto } from "@/types";

export interface Preferencias {
  categorias: Record<string, number>;
  produtosClicados: string[];
  sessaoId: string;
}

export interface ResultadoRank {
  produto: Produto;
  score: number;
  motivo: string;
}

function gerarId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function iniciarSessao(): Preferencias {
  return {
    categorias: {},
    produtosClicados: [],
    sessaoId: gerarId(),
  };
}

export function carregarPreferencias(): Preferencias {
  if (typeof window === "undefined") return iniciarSessao();
  const raw = sessionStorage.getItem("prefs");
  if (raw) {
    try {
      return JSON.parse(raw) as Preferencias;
    } catch {
      /* fallback */
    }
  }
  const prefs = iniciarSessao();
  salvarPreferencias(prefs);
  return prefs;
}

export function salvarPreferencias(prefs: Preferencias): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem("prefs", JSON.stringify(prefs));
}

export function registrarClique(
  produtoId: string,
  categoria: string,
): void {
  const prefs = carregarPreferencias();
  prefs.categorias[categoria] = (prefs.categorias[categoria] || 0) + 1;
  prefs.produtosClicados = [
    produtoId,
    ...prefs.produtosClicados.filter((id) => id !== produtoId),
  ].slice(0, 10);
  salvarPreferencias(prefs);
}

function top2Categorias(categorias: Record<string, number>): string[] {
  return Object.entries(categorias)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([cat]) => cat);
}

export function calcularScore(
  produto: Produto,
  prefs: Preferencias,
): { score: number; motivo: string } {
  let score = 0;
  const partes: string[] = [];
  const catClicks = prefs.categorias[produto.categoria] || 0;
  const top2 = top2Categorias(prefs.categorias);

  if (top2.includes(produto.categoria)) {
    score += 3;
    partes.push("categoria entre as top 2 (+3)");
  }

  if (catClicks >= 1 && !top2.includes(produto.categoria)) {
    score += 2;
    partes.push("categoria já clicada (+2)");
  }

  if (prefs.produtosClicados.includes(produto.id)) {
    score += 1;
    partes.push("produto já clicado (+1)");
  }

  if (catClicks > 1) {
    const extra = Math.min(catClicks - 1, 4) * 0.5;
    score += extra;
    partes.push(`+${extra.toFixed(1)} por cliques extras (+${extra.toFixed(1)})`);
  }

  return {
    score: Math.round(score * 100) / 100,
    motivo: partes.length > 0 ? partes.join("; ") : "sem interações anteriores",
  };
}

export function ranquear(
  produtos: Produto[],
  prefs: Preferencias,
): ResultadoRank[] {
  return produtos
    .map((produto) => {
      const { score, motivo } = calcularScore(produto, prefs);
      return { produto, score, motivo };
    })
    .sort((a, b) => b.score - a.score || a.produto.nome.localeCompare(b.produto.nome));
}
