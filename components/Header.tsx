"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export function Header() {
  const { totalItens } = useCart();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="text-xl font-bold tracking-tight shrink-0">
          PetRocker 🤘🐾
        </Link>

        <nav className="hidden sm:flex items-center gap-6 text-sm text-gray-400">
          <Link href="/" className="hover:text-white transition-colors">
            Início
          </Link>
          <Link href="/#produtos" className="hover:text-white transition-colors">
            Produtos
          </Link>
          <Link href="/carrinho" className="hover:text-white transition-colors">
            Carrinho
            {totalItens > 0 && (
              <span className="ml-1 text-red-400 font-bold">
                ({totalItens})
              </span>
            )}
          </Link>
        </nav>

        <Link
          href="/carrinho"
          className="relative text-2xl hover:opacity-80 transition-opacity sm:hidden"
        >
          🛒
          {totalItens > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
              {totalItens}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
