// TODO: Substituir esta implementação simulada pela chamada real à API do InfinitePay.
// Documentação: https://developers.infinitepay.io/
//
// Exemplo de integração:
//
// import { InfinitePay } from "infinitepay-sdk";
//
// const infinitepay = new InfinitePay({
//   handle: process.env.INFINITEPAY_HANDLE,
//   apiKey: process.env.INFINITEPAY_API_KEY,
// });
//
// const charge = await infinitepay.createCharge({
//   amount: total * 100, // centavos
//   items: items.map(({ nome, preco, quantidade }) => ({
//     name: nome,
//     unitPrice: Math.round(preco * 100),
//     quantity: quantidade,
//   })),
//   redirectUrl: `https://${process.env.NEXT_PUBLIC_APP_NAME}.com/obrigado`,
// });
//
// return Response.json({ url: charge.checkoutUrl, pedidoId: charge.id, total });

import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
    return Response.json({ error: "Carrinho vazio" }, { status: 400 });
  }

  const pedidoId =
    "PED-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();

  return Response.json({
    url: "/checkout-simulado",
    pedidoId,
    total: body.total,
  });
}
