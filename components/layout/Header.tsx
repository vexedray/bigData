"use client";

import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import styles from "./Header.module.css";

export function Header() {
  const { totalItens } = useCart();

  return (
    <header className={styles.header}>
      <div className={styles.promoBar}>
        🎸 Cupom <span className="font-mono">ROCK10</span> - 10% off na primeira compra!
      </div>
      <div className={styles.navWrapper}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.logo}>
            PetRocker 🤘🐾
          </Link>

          <nav className={styles.desktopNav}>
            <Link href="/" className={styles.navLink}>
              Início
            </Link>
            <Link href="/#produtos" className={styles.navLink}>
              Produtos
            </Link>
            <Link href="/carrinho" className={styles.cartLink}>
              <span className="text-2xl">🛒</span>
              {totalItens > 0 && <span className={styles.badge}>{totalItens}</span>}
            </Link>
          </nav>

          <Link href="/carrinho" className={styles.mobileCart}>
            🛒
            {totalItens > 0 && <span className={styles.badge}>{totalItens}</span>}
          </Link>
        </div>
      </div>
    </header>
  );
}
