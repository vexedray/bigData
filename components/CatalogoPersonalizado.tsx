"use client";

import { useState, useEffect, useCallback } from "react";
import type { Produto } from "@/types";
import type { Preferencias, ResultadoRank } from "@/lib/ranqueador";
import {
  carregarPreferencias,
  registrarClique,
  salvarPreferencias,
  ranquear,
} from "@/lib/ranqueador";
import { useCart } from "@/lib/cart-context";

function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function CatalogoPersonalizado({
  produtos,
}: {
  produtos: Produto[];
}) {
  const { adicionar } = useCart();
  const [adicionadoId, setAdicionadoId] = useState<string | null>(null);
  const [modo, setModo] = useState<"padrao" | "personalizado">("padrao");
  const [prefs, setPrefs] = useState<Preferencias | null>(null);
  const [resultados, setResultados] = useState<ResultadoRank[]>([]);
  const [devAberto, setDevAberto] = useState(false);

  useEffect(() => {
    const p = carregarPreferencias();
    setPrefs(p);
    setResultados(ranquear(produtos, p));
  }, [produtos]);

  const registrarInteracao = useCallback(
    (produto: Produto) => {
      registrarClique(produto.id, produto.categoria);
      const p = carregarPreferencias();
      setPrefs(p);
      if (modo === "personalizado") {
        setResultados(ranquear(produtos, p));
      }
    },
    [modo, produtos],
  );

  const handleAdicionar = useCallback(
    (produto: Produto) => {
      adicionar(produto);
      registrarInteracao(produto);
      setAdicionadoId(produto.id);
      setTimeout(() => setAdicionadoId(null), 1500);
    },
    [adicionar, registrarInteracao],
  );

  const toggleModo = useCallback(() => {
    setModo((prev) => {
      const novo = prev === "padrao" ? "personalizado" : "padrao";
      if (novo === "personalizado") {
        const p = carregarPreferencias();
        setPrefs(p);
        setResultados(ranquear(produtos, p));
      }
      return novo;
    });
  }, [produtos]);

  function resetar() {
    const nova: Preferencias = {
      categorias: {},
      produtosClicados: [],
      sessaoId: Math.random().toString(36).slice(2, 10),
    };
    salvarPreferencias(nova);
    setPrefs(nova);
    setResultados(ranquear(produtos, nova));
  }

  const visualizados =
    modo === "personalizado"
      ? resultados.map((r) => r.produto)
      : produtos;

  const totalInteracoes = prefs
    ? Object.values(prefs.categorias).reduce((a, b) => a + b, 0)
    : 0;

  const maiorScore = resultados.length > 0 ? resultados[0].score : 0;

  const scorePorId = new Map(
    resultados.map((r) => [r.produto.id, r]),
  );

  return (
    <section
      id="produtos"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">Nossos Produtos</h2>
        <button
          onClick={toggleModo}
          className="rounded-lg border border-gray-600 hover:bg-gray-800 px-4 py-2 text-sm font-semibold transition-colors"
        >
          {modo === "padrao"
            ? "📊 Ver por relevância"
            : "📋 Ordem padrão"}
        </button>
      </div>

      {modo === "personalizado" && totalInteracoes > 0 && (
        <div className="mb-6 rounded-lg bg-red-900/30 border border-red-800/50 px-4 py-3 text-sm text-red-200">
          📊 Ordenando com base nas suas preferências · {totalInteracoes}{" "}
          interaç{totalInteracoes !== 1 ? "ões" : "ão"}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {visualizados.map((p) => {
          const info = scorePorId.get(p.id);
          const isTop = modo === "personalizado" && info && info.score === maiorScore && maiorScore > 0;

          return (
            <div
              key={p.id}
              onClick={() => registrarInteracao(p)}
              className="rounded-xl bg-gray-800 border border-gray-700 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-200 p-6 flex flex-col relative cursor-pointer"
            >
              {modo === "personalizado" && info && info.score > 0 && (
                <span
                  title={info.motivo}
                  className={`absolute top-2 right-2 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    isTop
                      ? "bg-yellow-500 text-yellow-950"
                      : "bg-red-800/80 text-red-200"
                  }`}
                >
                  {isTop ? "🔝 " : "⭐ "}
                  +{info.score}
                </span>
              )}

              <div className="text-6xl text-center mb-4">{p.emoji}</div>
              <h3 className="font-bold text-lg">{p.nome}</h3>
              <p className="text-sm text-gray-500 mt-1">{p.categoria}</p>
              <p className="text-sm text-gray-400 mt-2 flex-1">
                {p.descricao}
              </p>
              <p className="text-xl font-bold mt-4 text-red-400">
                {formatarPreco(p.preco)}
              </p>
              {!p.emEstoque && (
                <span className="mt-2 inline-block rounded bg-red-900/60 text-red-300 text-xs font-semibold px-2.5 py-1 text-center">
                  Sem estoque
                </span>
              )}
              {p.emEstoque && modo === "personalizado" && info && (
                <span className="mt-1 text-[10px] text-gray-600 italic">
                  {info.motivo}
                </span>
              )}
              <button
                disabled={!p.emEstoque}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAdicionar(p);
                }}
                className={`mt-4 w-full rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                  p.emEstoque
                    ? "bg-red-800 hover:bg-red-700 text-white"
                    : "bg-gray-700 text-gray-500 cursor-not-allowed"
                }`}
              >
                {adicionadoId === p.id
                  ? "✓ Adicionado!"
                  : "Adicionar ao carrinho"}
              </button>
            </div>
          );
        })}
      </div>

      {process.env.NODE_ENV === "development" && prefs && (
        <div className="mt-12 border-t border-gray-700 pt-6">
          <button
            onClick={() => setDevAberto((v) => !v)}
            className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
          >
            {devAberto ? "▾" : "▸"} Painel de depuração — Ranqueador
          </button>
          {devAberto && (
            <div className="mt-4 space-y-3 text-sm text-gray-400">
              <div>
                <span className="font-semibold text-gray-300">
                  Categorias e scores:
                </span>
                <ul className="list-disc list-inside mt-1">
                  {Object.entries(prefs.categorias).map(([cat, qtd]) => (
                    <li key={cat}>
                      {cat}: {qtd} clique{qtd !== 1 ? "s" : ""}
                    </li>
                  ))}
                  {Object.keys(prefs.categorias).length === 0 && (
                    <li className="text-gray-600">Nenhuma ainda</li>
                  )}
                </ul>
              </div>
              <div>
                <span className="font-semibold text-gray-300">
                  Últimos produtos clicados:
                </span>
                <ul className="list-disc list-inside mt-1">
                  {prefs.produtosClicados.map((id) => (
                    <li key={id}>
                      {produtos.find((p) => p.id === id)?.nome ?? id}
                    </li>
                  ))}
                  {prefs.produtosClicados.length === 0 && (
                    <li className="text-gray-600">Nenhum ainda</li>
                  )}
                </ul>
              </div>
              <div>
                <span className="font-semibold text-gray-300">
                  Sessão:
                </span>{" "}
                <span className="font-mono">{prefs.sessaoId}</span>
              </div>
              <button
                onClick={resetar}
                className="rounded bg-gray-700 hover:bg-gray-600 px-3 py-1.5 text-xs font-semibold transition-colors"
              >
                Resetar preferências
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
