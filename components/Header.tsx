"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export function Header() {
  const { totalItens } = useCart();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          PetRocker 🤘🐾
        </Link>
        {totalItens > 0 && (
          <Link
            href="/carrinho"
            className="relative text-2xl hover:opacity-80 transition-opacity"
          >
            🛒
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
              {totalItens}
            </span>
          </Link>
        )}
      </div>
    </header>
  );
}
