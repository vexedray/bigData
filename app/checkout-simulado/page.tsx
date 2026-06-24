"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
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
    router.push("/obrigado?pedidoId=" + pedidoId);
  }

  return (
    <div className="min-h-screen flex flex-col pt-16">
      <main className="flex-1 max-w-xl mx-auto w-full px-4 py-8">
        <h1 className="text-2xl font-bold mb-2">Checkout</h1>
        <p className="text-gray-400 mb-6">
          Pedido <span className="font-mono text-red-400">{pedidoId}</span>
        </p>
        <p className="text-lg mb-8">
          Total:{" "}
          <span className="font-bold text-red-400">{formatarPreco(total)}</span>
        </p>

        <form onSubmit={handleConfirmar} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">
              Nome completo
            </label>
            <input
              type="text"
              required
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">E-mail</label>
            <input
              type="email"
              required
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">CPF</label>
            <input
              type="text"
              required
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-800"
            />
          </div>
          <div>
            <span className="block text-sm font-medium mb-2">
              Forma de pagamento
            </span>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 cursor-pointer has-[:checked]:border-red-800 has-[:checked]:bg-red-900/20 transition-colors">
                <input
                  type="radio"
                  name="pagamento"
                  defaultChecked
                  className="accent-red-800"
                />
                <span className="text-sm">Pix</span>
              </label>
              <label className="flex items-center gap-2 rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 cursor-pointer has-[:checked]:border-red-800 has-[:checked]:bg-red-900/20 transition-colors">
                <input
                  type="radio"
                  name="pagamento"
                  className="accent-red-800"
                />
                <span className="text-sm">Cartão</span>
              </label>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-red-800 hover:bg-red-700 disabled:bg-gray-700 disabled:text-gray-500 px-6 py-3 text-sm font-semibold transition-colors"
          >
            {loading ? "Processando..." : "Confirmar e pagar"}
          </button>
        </form>
      </main>
    </div>
  );
}

export default function CheckoutSimulado() {
  return (
    <Suspense>
      <CheckoutContent />
    </Suspense>
  );
}
