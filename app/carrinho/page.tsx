"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";

function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function Carrinho() {
  const router = useRouter();
  const { items, remover, atualizarQuantidade, total } = useCart();
  const [finalizando, setFinalizando] = useState(false);
  const [erro, setErro] = useState("");

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col pt-16">
        <main className="flex-1 flex flex-col items-center justify-center gap-4 px-4">
          <span className="text-6xl">🛒</span>
          <h1 className="text-2xl font-bold">Carrinho vazio</h1>
          <p className="text-gray-400">
            Seu carrinho está esperando por produtos rockeiros!
          </p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-lg bg-red-800 hover:bg-red-700 px-6 py-3 text-sm font-semibold transition-colors"
          >
            Ver produtos
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pt-16">
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-8">Seu Carrinho</h1>

        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.produto.id}
              className="flex items-center gap-4 rounded-xl bg-gray-800 border border-gray-700 p-4"
            >
              <span className="text-4xl">{item.produto.emoji}</span>

              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{item.produto.nome}</p>
                <p className="text-sm text-gray-400">
                  {formatarPreco(item.produto.preco)} cada
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    atualizarQuantidade(
                      item.produto.id,
                      item.quantidade - 1,
                    )
                  }
                  className="rounded bg-gray-700 hover:bg-gray-600 w-8 h-8 flex items-center justify-center text-sm font-bold transition-colors"
                >
                  −
                </button>
                <span className="w-8 text-center font-semibold">
                  {item.quantidade}
                </span>
                <button
                  onClick={() =>
                    atualizarQuantidade(
                      item.produto.id,
                      item.quantidade + 1,
                    )
                  }
                  className="rounded bg-gray-700 hover:bg-gray-600 w-8 h-8 flex items-center justify-center text-sm font-bold transition-colors"
                >
                  +
                </button>
              </div>

              <p className="font-bold text-red-400 min-w-[90px] text-right">
                {formatarPreco(item.produto.preco * item.quantidade)}
              </p>

              <button
                onClick={() => remover(item.produto.id)}
                className="text-gray-500 hover:text-red-400 transition-colors text-lg"
                title="Remover"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-xl bg-gray-800 border border-gray-700 p-6">
          <div className="flex items-center justify-between text-lg">
            <span className="font-semibold">Total</span>
            <span className="font-bold text-xl text-red-400">
              {formatarPreco(total)}
            </span>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link
            href="/"
            className="flex-1 text-center rounded-lg border border-gray-600 hover:bg-gray-800 px-6 py-3 text-sm font-semibold transition-colors"
          >
            Continuar comprando
          </Link>
          <button
            onClick={async () => {
              setFinalizando(true);
              setErro("");
              try {
                const payload = {
                  items: items.map((i) => ({
                    nome: i.produto.nome,
                    preco: i.produto.preco,
                    quantidade: i.quantidade,
                  })),
                  total,
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
                router.push(data.url + "?pedidoId=" + data.pedidoId + "&total=" + data.total);
              } catch (e: unknown) {
                const msg =
                  e instanceof Error ? e.message : "Erro inesperado";
                setErro(msg);
                setFinalizando(false);
              }
            }}
            disabled={finalizando}
            className="flex-1 rounded-lg bg-red-800 hover:bg-red-700 disabled:bg-gray-700 disabled:text-gray-500 px-6 py-3 text-sm font-semibold transition-colors"
          >
            {finalizando ? "Processando..." : "Finalizar compra"}
          </button>
        </div>
        {erro && (
          <p className="mt-4 text-sm text-red-400 text-center">{erro}</p>
        )}
      </main>
    </div>
  );
}
