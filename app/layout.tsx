import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { CartProvider } from "@/contexts/CartContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "PetRocker 🤘🐾",
  description:
    "Pet shop especializado em pet rocks e acessórios rock'n'roll para seu melhor amigo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <CartProvider>
          <Header />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
