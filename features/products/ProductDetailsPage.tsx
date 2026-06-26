"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { produtos } from "@/data/products";
import styles from "./ProductDetailsPage.module.css";

function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { adicionar } = useCart();
  const [adicionado, setAdicionado] = useState(false);

  const produto = produtos.find((p) => p.id === params.id);

  if (!produto) {
    return (
      <div className={styles.notFoundPage}>
        <main className={styles.notFoundMain}>
          <span className={styles.notFoundIcon}>?</span>
          <h1 className={styles.notFoundTitle}>Produto não encontrado</h1>
          <Link href="/" className={styles.notFoundBtn}>
            Voltar ao catálogo
          </Link>
        </main>
      </div>
    );
  }

  function handleAdicionar() {
    if (!produto) return;
    adicionar(produto);
    setAdicionado(true);
    setTimeout(() => setAdicionado(false), 2000);
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Link href="/#produtos" className={styles.backLink}>
          ← Voltar ao catálogo
        </Link>

        <div className={styles.infoGrid}>
          <div className={styles.imageBox}>
            <span className={styles.emoji}>{produto.emoji}</span>
          </div>

          <div className={styles.infoCol}>
            <div className={styles.headerRow}>
              <span className={styles.headerEmoji}>{produto.emoji}</span>
              <div>
                <h1 className={styles.produtoNome}>{produto.nome}</h1>
                <p className={styles.produtoCategoria}>{produto.categoria}</p>
              </div>
            </div>

            <p className={styles.descricao}>{produto.descricao}</p>
            <p className={styles.preco}>{formatarPreco(produto.preco)}</p>

            {!produto.emEstoque && <span className={styles.semEstoque}>Sem estoque</span>}

            <div className={styles.actions}>
              <button
                disabled={!produto.emEstoque}
                onClick={handleAdicionar}
                className={`${styles.addBtn} ${
                  produto.emEstoque ? styles.addBtnActive : styles.btnDisabled
                }`}
              >
                {adicionado ? "✓ Adicionado ao carrinho" : "Adicionar ao carrinho"}
              </button>
              <button
                disabled={!produto.emEstoque}
                onClick={() => {
                  if (!produto) return;
                  adicionar(produto);
                  router.push("/carrinho");
                }}
                className={`${styles.buyBtn} ${
                  produto.emEstoque ? styles.buyBtnActive : styles.btnDisabled
                }`}
              >
                Comprar agora
              </button>
            </div>

            <div className={styles.specs}>
              <h2 className={styles.specsTitle}>Especificações</h2>
              <dl className={styles.specsList}>
                {produto.especificacoes.map((esp) => (
                  <div key={esp.chave} className={styles.specRow}>
                    <dt className={styles.specKey}>{esp.chave}:</dt>
                    <dd className={styles.specValue}>{esp.valor}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
