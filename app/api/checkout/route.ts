import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
    return Response.json({ error: "Carrinho vazio" }, { status: 400 });
  }

  const pedidoId =
    "PED-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();

  const handle = process.env.INFINITEPAY_HANDLE;

  if (handle) {
    const origin = request.headers.get("origin") || request.nextUrl.origin;

    try {
      const infinitepayRes = await fetch(
        "https://api.checkout.infinitepay.io/links",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            handle,
            redirect_url: `${origin}/obrigado`,
            webhook_url: `${origin}/api/webhook`,
            order_nsu: pedidoId,
            items: body.items.map((i: { nome: string; preco: number; quantidade: number }) => ({
              quantity: i.quantidade,
              price: Math.round(i.preco * 100),
              description: i.nome,
            })),
          }),
        },
      );

      if (!infinitepayRes.ok) {
        const errText = await infinitepayRes.text();
        console.error("Erro InfinitePay:", infinitepayRes.status, errText);
        return Response.json(
          { error: "Erro ao gerar link de pagamento. Tente novamente." },
          { status: 502 },
        );
      }

      const data = await infinitepayRes.json();

      return Response.json({
        url: data.url,
        pedidoId,
        total: body.total,
      });
    } catch {
      return Response.json(
        { error: "Erro de conexão com o gateway de pagamento." },
        { status: 502 },
      );
    }
  }

  // Fallback simulado quando INFINITEPAY_HANDLE não está configurado
  return Response.json({
    url: "/checkout-simulado",
    pedidoId,
    total: body.total,
  });
}
