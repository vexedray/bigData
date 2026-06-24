"use client";

import { useState, useRef, useEffect, useCallback } from "react";

type Mensagem = {
  role: "user" | "assistant";
  content: string;
};

export function ChatBot() {
  const [aberto, setAberto] = useState(false);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [inputAtual, setInputAtual] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [jaAbriu, setJaAbriu] = useState(false);
  const fimRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens, carregando]);

  const enviar = useCallback(async () => {
    const texto = inputAtual.trim();
    if (!texto || carregando) return;

    setInputAtual("");
    setMensagens((prev) => [...prev, { role: "user", content: texto }]);
    setCarregando(true);

    try {
      const historico = mensagens.map(({ role, content }) => ({
        role,
        content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensagem: texto, historico }),
      });

      const data = await res.json();

      if (res.ok) {
        setMensagens((prev) => [
          ...prev,
          { role: "assistant", content: data.resposta },
        ]);
      } else {
        setMensagens((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.erro || "Erro ao processar mensagem.",
          },
        ]);
      }
    } catch {
      setMensagens((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Erro de conexão. Tente novamente.",
        },
      ]);
    } finally {
      setCarregando(false);
    }
  }, [inputAtual, carregando, mensagens]);

  function abrirChat() {
    setAberto(true);
    if (!jaAbriu) {
      setJaAbriu(true);
      setMensagens([
        {
          role: "assistant",
          content:
            "🤘🐾 Bem-vindo ao PetRocker! Como posso ajudar você e seu pet rock hoje?",
        },
      ]);
    }
  }

  return (
    <>
      {!aberto && (
        <button
          onClick={abrirChat}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-red-800 hover:bg-red-700 text-white text-2xl shadow-2xl hover:shadow-red-800/40 transition-all duration-200 flex items-center justify-center"
          aria-label="Abrir atendimento"
        >
          💬
        </button>
      )}

      {aberto && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] h-[500px] rounded-2xl bg-gray-900 border border-gray-700 shadow-2xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between bg-red-800 px-4 py-3">
            <div>
              <p className="font-semibold text-sm">Atendimento PetRocker</p>
              <p className="text-[10px] text-red-200 opacity-80">
                Powered by IA
              </p>
            </div>
            <button
              onClick={() => setAberto(false)}
              className="text-white/80 hover:text-white text-lg"
              aria-label="Fechar"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {mensagens.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-red-800 text-white rounded-br-md"
                      : "bg-gray-100 text-gray-900 rounded-bl-md"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {carregando && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 rounded-2xl rounded-bl-md px-4 py-3 text-sm">
                  <span className="inline-flex gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                  </span>
                </div>
              </div>
            )}
            <div ref={fimRef} />
          </div>

          <div className="border-t border-gray-700 px-4 py-3 flex gap-2">
            <input
              type="text"
              value={inputAtual}
              onChange={(e) => setInputAtual(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") enviar();
              }}
              disabled={carregando}
              placeholder="Digite sua mensagem..."
              className="flex-1 rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-800 disabled:opacity-50"
            />
            <button
              onClick={enviar}
              disabled={carregando || !inputAtual.trim()}
              className="rounded-lg bg-red-800 hover:bg-red-700 disabled:bg-gray-700 disabled:text-gray-500 text-white px-3 py-2 text-sm font-semibold transition-colors"
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
