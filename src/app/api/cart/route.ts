import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createProductCheckout } from "@/lib/stripe";

const checkoutSchema = z.object({
  items: z
    .array(z.object({ productId: z.string(), quantity: z.number().int().positive() }))
    .min(1),
  paymentMethod: z.enum(["CARD", "INTERAC"]).default("CARD"),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user.id || !session.user.email) {
    return NextResponse.json({ error: "Connexion requise" }, { status: 401 });
  }

  const body = await req.json() as unknown;
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const { items, paymentMethod } = parsed.data;
  const productIds = items.map((i) => i.productId);

  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isActive: true },
  });

  if (products.length !== productIds.length) {
    return NextResponse.json({ error: "Un ou plusieurs produits sont introuvables" }, { status: 400 });
  }

  const isMember = session.user.isMember ?? false;

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId)!;
    if (product.stock < item.quantity) {
      return NextResponse.json({ error: `Stock insuffisant pour "${product.name}"` }, { status: 400 });
    }
    if (product.isMemberOnly && !isMember) {
      return NextResponse.json({ error: `"${product.name}" est réservé aux membres` }, { status: 403 });
    }
  }

  const lineItems = items.map((item) => {
    const product = products.find((p) => p.id === item.productId)!;
    const unitPrice =
      isMember && product.memberPrice
        ? parseFloat(product.memberPrice.toString())
        : parseFloat(product.price.toString());
    return { productId: item.productId, quantity: item.quantity, unitPrice };
  });

  const subtotal = lineItems.reduce((sum, li) => sum + li.unitPrice * li.quantity, 0);
  const shipping = subtotal >= 75 ? 0 : 9.99;
  const tax = parseFloat((subtotal * 0.14975).toFixed(2)); // QC TPS+TVQ
  const total = parseFloat((subtotal + shipping + tax).toFixed(2));

  const order = await prisma.$transaction(async (tx) => {
    // 1. Create order
    const o = await tx.order.create({
      data: {
        userId: session.user.id,
        status: "PENDING",
        paymentMethod,
        subtotal,
        tax,
        shipping,
        total,
        items: {
          create: lineItems.map((li) => ({
            productId: li.productId,
            quantity: li.quantity,
            unitPrice: li.unitPrice,
            total: parseFloat((li.unitPrice * li.quantity).toFixed(2)),
          })),
        },
      },
    });

    // 2. Decrement stock
    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return o;
  });

  if (paymentMethod === "INTERAC") {
    return NextResponse.json({ success: true, orderId: order.id });
  }

  const origin =
    req.headers.get("origin") ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000";

  const stripeSession = await createProductCheckout({
    orderId: order.id,
    lineItems: lineItems.map((li) => {
      const product = products.find((p) => p.id === li.productId)!;
      const rawImage = product.images[0];
      // Stripe requires absolute HTTPS URLs — skip local/relative paths
      const imageUrl =
        rawImage && rawImage.startsWith("http") ? rawImage : undefined;
      return {
        name: product.name,
        amountCents: Math.round(li.unitPrice * 100),
        quantity: li.quantity,
        imageUrl,
      };
    }),
    clientEmail: session.user.email,
    successUrl: `${origin}/shop/cart/success?orderId=${order.id}`,
    cancelUrl: `${origin}/shop/cart`,
  });

  return NextResponse.json({ url: stripeSession.url });
}
