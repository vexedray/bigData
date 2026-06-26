"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import styles from "./CartPage.module.css";

function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function CartPage() {
  const router = useRouter();
  const { items, remover, atualizarQuantidade, total } = useCart();
  const [finalizando, setFinalizando] = useState(false);
  const [erro, setErro] = useState("");
  const [cupom, setCupom] = useState("");
  const [cupomValido, setCupomValido] = useState(false);
  const [cupomErro, setCupomErro] = useState("");

  const desconto = cupomValido ? total * 0.1 : 0;
  const totalComDesconto = total - desconto;

  function aplicarCupom() {
    if (cupom.trim().toUpperCase() === "ROCK10") {
      setCupomValido(true);
      setCupomErro("");
      return;
    }

    setCupomValido(false);
    setCupomErro("Cupom inválido");
  }

  async function finalizarCompra() {
    setFinalizando(true);
    setErro("");

    try {
      const payload = {
        items: items.map((i) => ({
          nome: i.produto.nome,
          preco: i.produto.preco,
          quantidade: i.quantidade,
        })),
        total: totalComDesconto,
        cupom: cupomValido ? "ROCK10" : undefined,
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao finalizar compra");
      }

      const data = await res.json();

      if (data.url.startsWith("/")) {
        router.push(`${data.url}?pedidoId=${data.pedidoId}&total=${data.total}`);
        return;
      }

      router.push(data.url);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro inesperado";
      setErro(msg);
      setFinalizando(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className={styles.emptyPage}>
        <main className={styles.emptyMain}>
          <span className={styles.emptyEmoji}>🛒</span>
          <h1 className={styles.emptyTitle}>Carrinho vazio</h1>
          <p className={styles.emptyText}>
            Seu carrinho está esperando por produtos rockeiros!
          </p>
          <Link href="/" className={styles.emptyBtn}>
            Ver produtos
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Seu Carrinho</h1>

        <div className={styles.itemList}>
          {items.map((item) => (
            <div key={item.produto.id} className={styles.item}>
              <span className={styles.itemEmoji}>{item.produto.emoji}</span>

              <div className={styles.itemInfo}>
                <p className={styles.itemNome}>{item.produto.nome}</p>
                <p className={styles.itemPreco}>{formatarPreco(item.produto.preco)} cada</p>
              </div>

              <div className={styles.qtyControls}>
                <button
                  onClick={() => atualizarQuantidade(item.produto.id, item.quantidade - 1)}
                  className={styles.qtyBtn}
                >
                  −
                </button>
                <span className={styles.qtyValue}>{item.quantidade}</span>
                <button
                  onClick={() => atualizarQuantidade(item.produto.id, item.quantidade + 1)}
                  className={styles.qtyBtn}
                >
                  +
                </button>
              </div>

              <p className={styles.itemTotal}>
                {formatarPreco(item.produto.preco * item.quantidade)}
              </p>

              <button
                onClick={() => remover(item.produto.id)}
                className={styles.removeBtn}
                title="Remover"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className={styles.cupomBox}>
          <div className={styles.cupomRow}>
            <input
              type="text"
              value={cupom}
              onChange={(e) => {
                setCupom(e.target.value);
                setCupomValido(false);
                setCupomErro("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") aplicarCupom();
              }}
              placeholder="Cupom de desconto"
              className={styles.cupomInput}
            />
            <button onClick={aplicarCupom} className={styles.cupomBtn}>
              Aplicar
            </button>
          </div>
          {cupomValido && (
            <p className={styles.cupomSuccess}>🎸 Cupom ROCK10 aplicado! 10% de desconto</p>
          )}
          {cupomErro && <p className={styles.cupomError}>{cupomErro}</p>}
        </div>

        <div className={styles.totalBox}>
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Subtotal</span>
            <span className={styles.totalValue}>{formatarPreco(total)}</span>
          </div>
          {cupomValido && (
            <div className={styles.totalRow}>
              <span className={styles.discountLabel}>Desconto (10%)</span>
              <span className={styles.discountValue}>-{formatarPreco(desconto)}</span>
            </div>
          )}
          <div className={styles.grandTotalRow}>
            <span className={styles.grandTotalLabel}>Total</span>
            <span className={styles.grandTotalValue}>{formatarPreco(totalComDesconto)}</span>
          </div>
        </div>

        <div className={styles.actions}>
          <Link href="/" className={styles.continueBtn}>
            Continuar comprando
          </Link>
          <button
            onClick={finalizarCompra}
            disabled={finalizando}
            className={styles.checkoutBtn}
          >
            {finalizando ? "Processando..." : "Finalizar compra"}
          </button>
        </div>
        {erro && <p className={styles.errorMsg}>{erro}</p>}
      </main>
    </div>
  );
}
