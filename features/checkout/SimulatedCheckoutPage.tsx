"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import styles from "./SimulatedCheckoutPage.module.css";

function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pedidoId = searchParams.get("pedidoId") || "";
  const total = Number(searchParams.get("total")) || 0;
  const [loading, setLoading] = useState(false);

  async function handleConfirmar(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    router.push(`/obrigado?pedidoId=${pedidoId}`);
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Checkout</h1>
        <p className={styles.pedidoId}>
          Pedido <span className={styles.pedidoCode}>{pedidoId}</span>
        </p>
        <p className={styles.total}>
          Total: <span className={styles.totalValue}>{formatarPreco(total)}</span>
        </p>

        <form onSubmit={handleConfirmar} className={styles.form}>
          <div>
            <label className={styles.fieldLabel}>Nome completo</label>
            <input type="text" required className={styles.input} />
          </div>
          <div>
            <label className={styles.fieldLabel}>E-mail</label>
            <input type="email" required className={styles.input} />
          </div>
          <div>
            <label className={styles.fieldLabel}>CPF</label>
            <input type="text" required className={styles.input} />
          </div>
          <div>
            <span className={styles.paymentLabel}>Forma de pagamento</span>
            <div className={styles.paymentOptions}>
              <label className={styles.paymentOption}>
                <input type="radio" name="pagamento" defaultChecked className={styles.paymentInput} />
                <span className={styles.paymentText}>Pix</span>
              </label>
              <label className={styles.paymentOption}>
                <input type="radio" name="pagamento" className={styles.paymentInput} />
                <span className={styles.paymentText}>Cartão</span>
              </label>
            </div>
          </div>
          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? "Processando..." : "Confirmar e pagar"}
          </button>
        </form>
      </main>
    </div>
  );
}

export function SimulatedCheckoutPage() {
  return (
    <Suspense>
      <CheckoutContent />
    </Suspense>
  );
}
