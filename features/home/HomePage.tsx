"use client";

import Link from "next/link";
import { produtos } from "@/data/products";
import { PersonalizedCatalog } from "@/features/catalog/PersonalizedCatalog";
import styles from "./HomePage.module.css";

const categorias = [
  { nome: "Alimentação", emoji: "🪨", desc: "Rações e petiscos minerais" },
  { nome: "Higiene", emoji: "🧴", desc: "Shampoos e cuidados" },
  { nome: "Brinquedos", emoji: "🎸", desc: "Diversão rockeira" },
  { nome: "Acessórios", emoji: "👕", desc: "Estilo e atitude" },
];

const diferenciais = [
  { icon: "🚚", label: "Frete Grátis", sub: "Acima de R$ 79" },
  { icon: "💳", label: "Pix e Cartão", sub: "Pagamento seguro" },
  { icon: "🔄", label: "Trocas em 7 dias", sub: "Sem burocracia" },
  { icon: "⚡", label: "Entrega Rápida", sub: "5 dias úteis" },
];

function ProdutoCard({
  nome,
  emoji,
  preco,
}: {
  nome: string;
  emoji: string;
  preco: number;
}) {
  return (
    <div className={styles.card}>
      <span className={styles.cardEmoji}>{emoji}</span>
      <div className={styles.cardContent}>
        <p className={styles.cardName}>{nome}</p>
      </div>
      <span className={styles.cardPrice}>
        {preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
      </span>
    </div>
  );
}

export function HomePage() {
  const destaques = produtos.filter((p) => p.emEstoque).slice(0, 4);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroBg}>
            <div className={styles.heroBgLeft}>🤘</div>
            <div className={styles.heroBgRight}>🎸</div>
            <div className={styles.heroBgCenter}>🪨</div>
          </div>
          <div className={styles.heroContent}>
            <span className={styles.heroEmoji}>🤘🐾</span>
            <h1 className={styles.heroTitle}>
              O Rock que seu
              <br />
              <span className={styles.heroAccent}>Pet Merece</span>
            </h1>
            <p className={styles.heroSub}>
              Tudo para o seu pet rock viver com estilo, atitude e muito
              rock&apos;n&apos;roll. Catálogo inteligente que aprende suas
              preferências.
            </p>
            <div className={styles.heroCta}>
              <Link href="#produtos" className={styles.btnPrimary}>
                Ver Produtos
              </Link>
              <Link href="#categorias" className={styles.btnSecondary}>
                Explorar Categorias
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.differentials}>
          <div className={styles.diffGrid}>
            {diferenciais.map((item) => (
              <div key={item.label}>
                <span className="text-2xl">{item.icon}</span>
                <p className="text-sm font-semibold mt-1">{item.label}</p>
                <p className="text-xs text-gray-500">{item.sub}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="categorias" className={`${styles.sectionContainer} ${styles.categorias}`}>
          <div className={styles.categoriasHeader}>
            <h2 className={styles.categoriasTitle}>Categorias</h2>
            <p className={styles.categoriasSub}>Encontre tudo para seu pet rock</p>
          </div>
          <div className={styles.categoriasGrid}>
            {categorias.map((cat) => (
              <Link
                key={cat.nome}
                href="/#produtos"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById("produtos");
                  el?.scrollIntoView({ behavior: "smooth" });
                  setTimeout(() => {
                    const select = document.querySelector<HTMLSelectElement>("#produtos select");
                    if (select) {
                      select.value = cat.nome;
                      select.dispatchEvent(new Event("change", { bubbles: true }));
                    }
                  }, 500);
                }}
                className={`${styles.categoriaCard} group`}
              >
                <span className={styles.categoriaEmoji}>{cat.emoji}</span>
                <h3 className={styles.categoriaNome}>{cat.nome}</h3>
                <p className={styles.categoriaDesc}>{cat.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.promoBanner}>
          <div className={styles.promoContent}>
            <span className={styles.promoEmoji}>🎸</span>
            <h3 className={styles.promoTitle}>Lançamento Rockeiro</h3>
            <p className={styles.promoText}>
              Aproveite 10% de desconto na primeira compra com o cupom{" "}
              <span className={styles.promoCode}>ROCK10</span>
            </p>
            <Link href="#produtos" className={styles.promoBtn}>
              Aproveitar Oferta
            </Link>
          </div>
        </section>

        <section className={`${styles.sectionContainer} ${styles.destaques}`}>
          <div className={styles.destaquesHeader}>
            <h2 className={styles.destaquesTitle}>🔥 Destaques</h2>
            <Link href="#produtos" className={styles.destaquesLink}>
              Ver todos →
            </Link>
          </div>
          <div className={styles.destaquesGrid}>
            {destaques.map((p) => (
              <ProdutoCard key={p.id} nome={p.nome} emoji={p.emoji} preco={p.preco} />
            ))}
          </div>
        </section>

        <PersonalizedCatalog produtos={produtos} />

        <section className={styles.newsletter}>
          <div className={styles.newsletterContent}>
            <span className={styles.newsletterEmoji}>📬</span>
            <h3 className={styles.newsletterTitle}>Fique por dentro das novidades</h3>
            <p className={styles.newsletterText}>
              Receba ofertas exclusivas e lançamentos direto no seu e-mail.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Inscrição simulada! Em breve você receberá novidades.");
              }}
              className={styles.newsletterForm}
            >
              <input
                type="email"
                required
                placeholder="seu@email.com"
                className={styles.newsletterInput}
              />
              <button type="submit" className={styles.newsletterBtn}>
                Inscrever
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div>
            <span className={styles.footerTitle}>PetRocker 🤘🐾</span>
            <p className={styles.footerDesc}>
              Pet shop temático de rock para quem ama seus pet rocks com estilo.
            </p>
          </div>
          <div>
            <h4 className={styles.footerHeading}>Links</h4>
            <div className={styles.footerLinks}>
              <Link href="/" className={styles.footerLink}>
                Início
              </Link>
              <Link href="/#produtos" className={styles.footerLink}>
                Produtos
              </Link>
              <Link href="/carrinho" className={styles.footerLink}>
                Carrinho
              </Link>
            </div>
          </div>
          <div>
            <h4 className={styles.footerHeading}>Contato</h4>
            <p>contato@petrocker.com.br</p>
            <p className="mt-1">(47) 99999-8888</p>
          </div>
        </div>
        <div className={styles.footerBottom}>Feito com ❤️ na aula de IA do SENAI SC</div>
      </footer>
    </div>
  );
}
