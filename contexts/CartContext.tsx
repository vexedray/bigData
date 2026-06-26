"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Produto } from "@/types";

export interface CartItem {
  produto: Produto;
  quantidade: number;
}

interface CartContextType {
  items: CartItem[];
  adicionar: (produto: Produto) => void;
  remover: (id: string) => void;
  atualizarQuantidade: (id: string, quantidade: number) => void;
  limpar: () => void;
  total: number;
  totalItens: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const adicionar = useCallback((produto: Produto) => {
    setItems((prev) => {
      const existente = prev.find((i) => i.produto.id === produto.id);

      if (existente) {
        return prev.map((i) =>
          i.produto.id === produto.id
            ? { ...i, quantidade: i.quantidade + 1 }
            : i,
        );
      }

      return [...prev, { produto, quantidade: 1 }];
    });
  }, []);

  const remover = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.produto.id !== id));
  }, []);

  const atualizarQuantidade = useCallback((id: string, quantidade: number) => {
    if (quantidade <= 0) {
      setItems((prev) => prev.filter((i) => i.produto.id !== id));
      return;
    }

    setItems((prev) =>
      prev.map((i) => (i.produto.id === id ? { ...i, quantidade } : i)),
    );
  }, []);

  const limpar = useCallback(() => {
    setItems([]);
  }, []);

  const total = useMemo(
    () => items.reduce((acc, i) => acc + i.produto.preco * i.quantidade, 0),
    [items],
  );

  const totalItens = useMemo(
    () => items.reduce((acc, i) => acc + i.quantidade, 0),
    [items],
  );

  return (
    <CartContext.Provider
      value={{
        items,
        adicionar,
        remover,
        atualizarQuantidade,
        limpar,
        total,
        totalItens,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart deve ser usado dentro de um CartProvider");
  }

  return context;
}
