"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import styles from "./ThankYouPage.module.css";

function ThankYouContent() {
  const searchParams = useSearchParams();
  const pedidoId = searchParams.get("pedidoId");

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <span className={styles.icon}>✓</span>
        <h1 className={styles.title}>Pedido confirmado</h1>
        <p className={styles.text}>
          Obrigado pela compra. Seu pet rock já está quase pronto para subir no palco.
        </p>
        {pedidoId && (
          <p className={styles.order}>
            Pedido <span>{pedidoId}</span>
          </p>
        )}
        <Link href="/" className={styles.button}>
          Voltar para a loja
        </Link>
      </main>
    </div>
  );
}

export function ThankYouPage() {
  return (
    <Suspense>
      <ThankYouContent />
    </Suspense>
  );
}
