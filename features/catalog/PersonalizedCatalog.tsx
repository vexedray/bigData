"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import {
  carregarPreferencias,
  ranquear,
  registrarClique,
  salvarPreferencias,
  type Preferencias,
  type ResultadoRank,
} from "@/services/productRanker";
import type { Produto } from "@/types";
import styles from "./PersonalizedCatalog.module.css";

function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function extractCategories(produtos: Produto[]): string[] {
  return Array.from(new Set(produtos.map((p) => p.categoria))).sort();
}

export function PersonalizedCatalog({ produtos }: { produtos: Produto[] }) {
  const { adicionar } = useCart();
  const [adicionadoId, setAdicionadoId] = useState<string | null>(null);
  const [modo, setModo] = useState<"padrao" | "personalizado">("padrao");
  const [prefs, setPrefs] = useState<Preferencias | null>(null);
  const [resultados, setResultados] = useState<ResultadoRank[]>([]);
  const [search, setSearch] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [devAberto, setDevAberto] = useState(false);

  const categorias = useMemo(() => extractCategories(produtos), [produtos]);

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

  const ordenados = modo === "personalizado" ? resultados.map((r) => r.produto) : produtos;

  const filtered = useMemo(() => {
    const termo = search.toLowerCase().trim();

    return ordenados.filter((p) => {
      if (categoriaFiltro && p.categoria !== categoriaFiltro) return false;

      if (termo) {
        return (
          p.nome.toLowerCase().includes(termo) ||
          p.categoria.toLowerCase().includes(termo) ||
          p.descricao.toLowerCase().includes(termo)
        );
      }

      return true;
    });
  }, [ordenados, search, categoriaFiltro]);

  const totalInteracoes = prefs
    ? Object.values(prefs.categorias).reduce((a, b) => a + b, 0)
    : 0;

  const maiorScore = resultados.length > 0 ? resultados[0].score : 0;
  const scorePorId = new Map(resultados.map((r) => [r.produto.id, r]));

  return (
    <section id="produtos" className={styles.section}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Nossos Produtos</h2>
        <button onClick={toggleModo} className={styles.toggleBtn}>
          {modo === "padrao" ? "📊 Ver por relevância" : "📋 Ordem padrão"}
        </button>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchWrapper}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar produto..."
            className={styles.input}
          />
        </div>
        <select
          value={categoriaFiltro}
          onChange={(e) => setCategoriaFiltro(e.target.value)}
          className={styles.select}
        >
          <option value="">Todas as categorias</option>
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {modo === "personalizado" && totalInteracoes > 0 && (
        <div className={styles.rankingBanner}>
          📊 Ordenando com base nas suas preferências · {totalInteracoes}{" "}
          interaç{totalInteracoes !== 1 ? "ões" : "ão"}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyIcon}>🔍</p>
          <p className={styles.emptyText}>Nenhum produto encontrado</p>
          <button
            onClick={() => {
              setSearch("");
              setCategoriaFiltro("");
            }}
            className={styles.clearBtn}
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className={styles.cardGrid}>
          {filtered.map((p) => {
            const info = scorePorId.get(p.id);
            const isTop =
              modo === "personalizado" && info && info.score === maiorScore && maiorScore > 0;

            return (
              <div key={p.id} className={styles.card}>
                <Link
                  href={`/produtos/${p.id}`}
                  onClick={() => registrarInteracao(p)}
                  className={styles.cardEmojiArea}
                >
                  <span className={styles.emojiLarge}>{p.emoji}</span>
                </Link>
                {modo === "personalizado" && info && info.score > 0 && (
                  <span
                    title={info.motivo}
                    className={`${styles.rankBadge} ${
                      isTop ? styles.rankBadgeTop : styles.rankBadgeNormal
                    }`}
                  >
                    {isTop ? "🔝 " : "⭐ "}+{info.score}
                  </span>
                )}

                <div className={styles.cardBody}>
                  <Link
                    href={`/produtos/${p.id}`}
                    onClick={() => registrarInteracao(p)}
                    className={styles.cardLink}
                  >
                    <span className={styles.emojiSmall}>{p.emoji}</span>
                    <h3 className={styles.produtoNome}>{p.nome}</h3>
                  </Link>
                  <p className={styles.categoria}>{p.categoria}</p>
                  <p className={styles.descricao}>{p.descricao}</p>
                  <p className={styles.preco}>{formatarPreco(p.preco)}</p>
                  {!p.emEstoque && <span className={styles.semEstoque}>Sem estoque</span>}
                  {p.emEstoque && modo === "personalizado" && info && (
                    <span className={styles.motivo}>{info.motivo}</span>
                  )}
                  <button
                    disabled={!p.emEstoque}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAdicionar(p);
                    }}
                    className={`${styles.addBtn} ${
                      p.emEstoque ? styles.addBtnActive : styles.addBtnDisabled
                    }`}
                  >
                    {adicionadoId === p.id ? "✓ Adicionado!" : "Adicionar ao carrinho"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {process.env.NODE_ENV === "development" && prefs && (
        <div className={styles.devPanel}>
          <button onClick={() => setDevAberto((v) => !v)} className={styles.devToggle}>
            {devAberto ? "▾" : "▸"} Painel de depuração - Ranqueador
          </button>
          {devAberto && (
            <div className={styles.devContent}>
              <div>
                <span className={styles.devLabel}>Categorias e scores:</span>
                <ul className={styles.devList}>
                  {Object.entries(prefs.categorias).map(([cat, qtd]) => (
                    <li key={cat}>
                      {cat}: {qtd} clique{qtd !== 1 ? "s" : ""}
                    </li>
                  ))}
                  {Object.keys(prefs.categorias).length === 0 && (
                    <li className={styles.devMuted}>Nenhuma ainda</li>
                  )}
                </ul>
              </div>
              <div>
                <span className={styles.devLabel}>Últimos produtos clicados:</span>
                <ul className={styles.devList}>
                  {prefs.produtosClicados.map((id) => (
                    <li key={id}>{produtos.find((p) => p.id === id)?.nome ?? id}</li>
                  ))}
                  {prefs.produtosClicados.length === 0 && (
                    <li className={styles.devMuted}>Nenhum ainda</li>
                  )}
                </ul>
              </div>
              <div>
                <span className={styles.devLabel}>Sessão:</span>{" "}
                <span className={styles.devMono}>{prefs.sessaoId}</span>
              </div>
              <button onClick={resetar} className={styles.devResetBtn}>
                Resetar preferências
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
