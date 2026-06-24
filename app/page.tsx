"use client";

import { useState } from "react";
import { produtos } from "@/lib/produtos";
import { useCart } from "@/lib/cart-context";

function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function Home() {
  const { adicionar } = useCart();
  const [adicionadoId, setAdicionadoId] = useState<string | null>(null);

  function handleAdicionar(produto: (typeof produtos)[number]) {
    adicionar(produto);
    setAdicionadoId(produto.id);
    setTimeout(() => setAdicionadoId(null), 1500);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pt-16">
        <section className="pb-12 px-4 text-center bg-gradient-to-b from-gray-800 to-gray-900">
          <div className="pt-24">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
              O Rock que seu Pet Merece
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
              Tudo para o seu pet rock viver com estilo, atitude e muito
              rock&apos;n&apos;roll.
            </p>
            <a
              href="#produtos"
              className="mt-8 inline-block rounded-lg bg-red-800 hover:bg-red-700 px-8 py-3 text-sm font-semibold transition-colors"
            >
              Ver Produtos
            </a>
          </div>
        </section>

        <section
          id="produtos"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        >
          <h2 className="text-2xl font-bold mb-8">Nossos Produtos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {produtos.map((p) => (
              <div
                key={p.id}
                className="rounded-xl bg-gray-800 border border-gray-700 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-200 p-6 flex flex-col"
              >
                <div className="text-6xl text-center mb-4">{p.emoji}</div>
                <h3 className="font-bold text-lg">{p.nome}</h3>
                <p className="text-sm text-gray-500 mt-1">{p.categoria}</p>
                <p className="text-sm text-gray-400 mt-2 flex-1">
                  {p.descricao}
                </p>
                <p className="text-xl font-bold mt-4 text-red-400">
                  {formatarPreco(p.preco)}
                </p>
                {!p.emEstoque && (
                  <span className="mt-2 inline-block rounded bg-red-900/60 text-red-300 text-xs font-semibold px-2.5 py-1 text-center">
                    Sem estoque
                  </span>
                )}
                <button
                  disabled={!p.emEstoque}
                  onClick={() => handleAdicionar(p)}
                  className={`mt-4 w-full rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                    p.emEstoque
                      ? "bg-red-800 hover:bg-red-700 text-white"
                      : "bg-gray-700 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {adicionadoId === p.id
                    ? "✓ Adicionado!"
                    : "Adicionar ao carrinho"}
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-800 py-6 text-center text-sm text-gray-500">
        Feito com ❤️ na aula de IA do SENAI SC
      </footer>
    </div>
  );
}
