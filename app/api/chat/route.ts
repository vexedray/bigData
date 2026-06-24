import { NextRequest } from "next/server";

const PRODUTOS = [
  { nome: "Pacote de Pedrinhas Nutritivas", preco: "R$ 19,90" },
  { nome: "Shampoo Brilho Rochoso 250ml", preco: "R$ 34,50" },
  { nome: "Guitarra de Brinquedo Squeak", preco: "R$ 59,90" },
  { nome: "Jaqueta de Couro Rocker (PP)", preco: "R$ 89,90" },
  { nome: "Suplemento Mineral Premium", preco: "R$ 49,90" },
  { nome: "Osso Microfone Cantor", preco: "R$ 44,90" },
  { nome: "Coleira Spike Preto", preco: "R$ 69,90" },
  { nome: "Óculos Escuros Rock Star", preco: "R$ 99,90" },
];

const LISTA_PRODUTOS = PRODUTOS.map(
  (p) => `- ${p.nome} — ${p.preco}`,
).join("\n");

const SYSTEM_PROMPT = `Você é "PetRocker 🤘🐾 Atendimento", assistente virtual de uma loja pet shop especializada em pet rocks e acessórios rock'n'roll.

SOBRE A LOJA:
- Nome: PetRocker 🤘🐾
- Nicho: Pet shop temático de rock para pet rocks (pedras de estimação)
- Site: https://PetRocker.com (simulado)
- Pagamento: Pix e cartão (simulado)
- Trocas: em até 7 dias após o recebimento
- Entrega: em até 5 dias úteis

PRODUTOS:
${LISTA_PRODUTOS}

REGRAS:
- Responda APENAS sobre assuntos relacionados à loja PetRocker.
- Se perguntarem algo fora do contexto da loja, diga educadamente que você só pode ajudar com dúvidas sobre a PetRocker.
- Nunca invente informações sobre produtos, preços ou políticas que não estejam listados acima.
- Seja cordial, use linguagem informal e tom amigável.
- Responda sempre em português do Brasil.
- Se o usuário pedir ajuda para escolher um produto, faça sugestões com base no catálogo disponível.`;

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.mensagem || typeof body.mensagem !== "string") {
    return Response.json({ erro: "Mensagem inválida" }, { status: 400 });
  }

  const historico = Array.isArray(body.historico) ? body.historico : [];

  try {
    const response = await fetch(
      "https://api.anthropic.com/v1/messages",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY || "",
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 400,
          system: SYSTEM_PROMPT,
          messages: [
            ...historico,
            { role: "user", content: body.mensagem },
          ],
        }),
      },
    );

    if (!response.ok) {
      console.error("Erro Anthropic:", response.status, await response.text());
      return Response.json(
        { erro: "Erro ao processar mensagem. Tente novamente mais tarde." },
        { status: 500 },
      );
    }

    const data = await response.json();
    const resposta =
      data.content?.[0]?.text || "Desculpe, não consegui processar sua mensagem.";

    return Response.json({ resposta });
  } catch {
    return Response.json(
      { erro: "Erro ao processar mensagem. Tente novamente mais tarde." },
      { status: 500 },
    );
  }
}
