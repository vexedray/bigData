import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { Header } from "@/components/Header";
import { ChatBot } from "@/components/ChatBot";

export const metadata: Metadata = {
  title: "PetRocker 🤘🐾 — O Rock que seu Pet Merece",
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
      <body className="bg-gray-900 text-gray-100 antialiased">
        <CartProvider>
          <Header />
          {children}
          <ChatBot />
        </CartProvider>
      </body>
    </html>
  );
}
