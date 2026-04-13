import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user.id) {
      return NextResponse.json({ items: [] });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
            slug: true,
            stock: true,
          },
        },
      },
    });

    const items = cartItems.map((ci) => ({
      id: ci.product.id,
      name: ci.product.name,
      price: parseFloat(ci.product.price.toString()),
      image: ci.product.images[0] || "",
      slug: ci.product.slug,
      quantity: ci.quantity,
      stock: ci.product.stock,
    }));

    return NextResponse.json({ items });
  } catch (error) {
    console.error("[CART_SYNC_GET]", error);
    return NextResponse.json({ error: "Erreur lors de la récupération du panier" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user.id) {
      return NextResponse.json({ error: "Connexion requise" }, { status: 401 });
    }

    const { items } = (await req.json()) as { items: { id: string; quantity: number }[] };

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    // Use a transaction to sync the cart
    await prisma.$transaction(async (tx) => {
      // 1. Delete existing cart items for the user
      await tx.cartItem.deleteMany({
        where: { userId: session.user.id },
      });

      // 2. Insert new items
      if (items.length > 0) {
        await tx.cartItem.createMany({
          data: items.map((item) => ({
            userId: session.user.id,
            productId: item.id,
            quantity: item.quantity,
          })),
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[CART_SYNC_POST]", error);
    return NextResponse.json({ error: "Erreur lors de la synchronisation du panier" }, { status: 500 });
  }
}
