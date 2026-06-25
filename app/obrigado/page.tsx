"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";

function ObrigadoContent() {
  const searchParams = useSearchParams();
  const pedidoId = searchParams.get("pedidoId") || searchParams.get("order_nsu") || "";
  const slug = searchParams.get("slug") || "";
  const { limpar } = useCart();

  return (
    <div className="min-h-screen flex flex-col pt-16">
      <main className="flex-1 flex flex-col items-center justify-center gap-4 px-4 text-center">
        <span className="text-7xl">🎉</span>
        <h1 className="text-3xl font-bold">Pedido realizado com sucesso!</h1>
        {pedidoId && (
          <p className="text-gray-400">
            Pedido{" "}
            <span className="font-mono text-red-400">{pedidoId}</span>
          </p>
        )}
        {slug && (
          <p className="text-xs text-gray-600">
            Fatura: {slug}
          </p>
        )}
        <Link
          href="/"
          onClick={limpar}
          className="mt-6 rounded-lg bg-red-800 hover:bg-red-700 px-6 py-3 text-sm font-semibold transition-colors"
        >
          Voltar ao catálogo
        </Link>
      </main>
    </div>
  );
}

export default function Obrigado() {
  return (
    <Suspense>
      <ObrigadoContent />
    </Suspense>
  );
}
