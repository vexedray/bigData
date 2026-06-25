import { produtos } from "@/lib/produtos";
import { CatalogoPersonalizado } from "@/components/CatalogoPersonalizado";

export default function Home() {
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

        <CatalogoPersonalizado produtos={produtos} />
      </main>

      <footer className="border-t border-gray-800 py-6 text-center text-sm text-gray-500">
        Feito com ❤️ na aula de IA do SENAI SC
      </footer>
    </div>
  );
}
