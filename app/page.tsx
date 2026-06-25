"use client";

import { useCallback } from "react";
import { produtos } from "@/lib/produtos";
import { CatalogoPersonalizado } from "@/components/CatalogoPersonalizado";
import Link from "next/link";

const categorias = [
  { nome: "Alimentação", emoji: "🪨", desc: "Rações e petiscos minerais" },
  { nome: "Higiene", emoji: "🧴", desc: "Shampoos e cuidados" },
  { nome: "Brinquedos", emoji: "🎸", desc: "Diversão rockeira" },
  { nome: "Acessórios", emoji: "👕", desc: "Estilo e atitude" },
];

function ProdutoCard({ nome, emoji, preco }: { nome: string; emoji: string; preco: number }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-gray-800/60 border border-gray-700 px-4 py-3 hover:bg-gray-800 transition-colors">
      <span className="text-2xl">{emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{nome}</p>
      </div>
      <span className="text-sm font-bold text-red-400 shrink-0">
        {preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
      </span>
    </div>
  );
}

export default function Home() {
  const destaques = produtos.filter((p) => p.emEstoque).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pt-16">
        {/* Hero Principal */}
        <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 text-8xl">🤘</div>
            <div className="absolute bottom-10 right-10 text-8xl">🎸</div>
            <div className="absolute top-1/2 left-1/3 text-6xl">🪨</div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36 text-center">
            <span className="inline-block text-7xl mb-6">🤘🐾</span>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
              O Rock que seu
              <br />
              <span className="text-red-400">Pet Merece</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
              Tudo para o seu pet rock viver com estilo, atitude e muito
              rock&apos;n&apos;roll. Catálogo inteligente que aprende suas
              preferências.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#produtos"
                className="rounded-lg bg-red-800 hover:bg-red-700 px-8 py-3.5 text-sm font-semibold transition-colors"
              >
                Ver Produtos
              </Link>
              <Link
                href="#categorias"
                className="rounded-lg border border-gray-600 hover:bg-gray-800 px-8 py-3.5 text-sm font-semibold transition-colors"
              >
                Explorar Categorias
              </Link>
            </div>
          </div>
        </section>

        {/* Diferenciais */}
        <section className="border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: "🚚", label: "Frete Grátis", sub: "Acima de R$ 79" },
              { icon: "💳", label: "Pix e Cartão", sub: "Pagamento seguro" },
              { icon: "🔄", label: "Trocas em 7 dias", sub: "Sem burocracia" },
              { icon: "⚡", label: "Entrega Rápida", sub: "5 dias úteis" },
            ].map((item) => (
              <div key={item.label}>
                <span className="text-2xl">{item.icon}</span>
                <p className="text-sm font-semibold mt-1">{item.label}</p>
                <p className="text-xs text-gray-500">{item.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Categorias */}
        <section id="categorias" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold">Categorias</h2>
            <p className="text-gray-400 mt-2">
              Encontre tudo para seu pet rock
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categorias.map((cat) => (
              <Link
                key={cat.nome}
                href={`/#produtos`}
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById("produtos");
                  el?.scrollIntoView({ behavior: "smooth" });
                  setTimeout(() => {
                    const select = document.querySelector<HTMLSelectElement>(
                      "#produtos select",
                    );
                    if (select) {
                      select.value = cat.nome;
                      select.dispatchEvent(new Event("change", { bubbles: true }));
                    }
                  }, 500);
                }}
                className="group rounded-xl bg-gray-800/50 border border-gray-700 hover:border-red-800/50 hover:bg-gray-800 p-6 text-center transition-all duration-200"
              >
                <span className="text-5xl block mb-3 group-hover:scale-110 transition-transform">
                  {cat.emoji}
                </span>
                <h3 className="font-bold text-lg">{cat.nome}</h3>
                <p className="text-sm text-gray-500 mt-1">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Banner Promocional */}
        <section className="bg-gradient-to-r from-red-900/30 via-red-800/20 to-red-900/30 border-y border-red-800/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
            <span className="text-4xl">🎸</span>
            <h3 className="text-xl sm:text-2xl font-bold mt-2">
              Lançamento Rockeiro
            </h3>
            <p className="text-gray-400 mt-1">
              Aproveite 10% de desconto na primeira compra com o cupom{" "}
              <span className="font-mono text-red-400 font-bold">
                ROCK10
              </span>
            </p>
            <Link
              href="#produtos"
              className="mt-4 inline-block rounded-lg bg-red-800 hover:bg-red-700 px-6 py-2.5 text-sm font-semibold transition-colors"
            >
              Aproveitar Oferta
            </Link>
          </div>
        </section>

        {/* Produtos em Destaque (mini preview) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">🔥 Destaques</h2>
            <Link
              href="#produtos"
              className="text-sm text-red-400 hover:underline"
            >
              Ver todos →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {destaques.map((p) => (
              <ProdutoCard
                key={p.id}
                nome={p.nome}
                emoji={p.emoji}
                preco={p.preco}
              />
            ))}
          </div>
        </section>

        {/* Catálogo completo com busca */}
        <CatalogoPersonalizado produtos={produtos} />

        {/* Newsletter */}
        <section className="border-t border-gray-800">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <span className="text-4xl">📬</span>
            <h3 className="text-xl sm:text-2xl font-bold mt-4">
              Fique por dentro das novidades
            </h3>
            <p className="text-gray-400 mt-2 mb-6">
              Receba ofertas exclusivas e lançamentos direto no seu e-mail.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Inscrição simulada! Em breve você receberá novidades.");
              }}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                placeholder="seu@email.com"
                className="flex-1 rounded-lg bg-gray-800 border border-gray-700 px-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-800"
              />
              <button
                type="submit"
                className="rounded-lg bg-red-800 hover:bg-red-700 px-6 py-2.5 text-sm font-semibold transition-colors shrink-0"
              >
                Inscrever
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer aprimorado */}
      <footer className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm text-gray-500">
          <div>
            <span className="text-lg font-bold text-gray-100">
              PetRocker 🤘🐾
            </span>
            <p className="mt-2">
              Pet shop temático de rock para quem ama seus pet rocks com
              estilo.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-300 mb-2">Links</h4>
            <div className="space-y-1">
              <Link href="/" className="block hover:text-white transition-colors">
                Início
              </Link>
              <Link href="/#produtos" className="block hover:text-white transition-colors">
                Produtos
              </Link>
              <Link href="/carrinho" className="block hover:text-white transition-colors">
                Carrinho
              </Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-300 mb-2">Contato</h4>
            <p>contato@petrocker.com.br</p>
            <p className="mt-1">(47) 99999-8888</p>
          </div>
        </div>
        <div className="border-t border-gray-800 py-6 text-center text-sm text-gray-600">
          Feito com ❤️ na aula de IA do SENAI SC
        </div>
      </footer>
    </div>
  );
}
