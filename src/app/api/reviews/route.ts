import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const createReviewSchema = z.object({
  productId: z.string().optional(),
  rating: z.number().int().min(1).max(5),
  body: z.string().max(2000).optional(),
});

// POST /api/reviews — create a review (authenticated users only)
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = await req.json() as unknown;
  const parsed = createReviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const { productId, rating, body: reviewBody } = parsed.data;

  // Check duplicate review
  if (productId) {
    const existing = await prisma.review.findFirst({
      where: { userId: session.user.id, productId },
    });
    if (existing) {
      return NextResponse.json({ error: "Vous avez déjà laissé un avis pour ce produit" }, { status: 409 });
    }
  }

  const review = await prisma.review.create({
    data: {
      userId: session.user.id,
      productId: productId ?? null,
      rating,
      body: reviewBody,
    },
    include: {
      user: { select: { name: true, image: true } },
    },
  });

  return NextResponse.json(review, { status: 201 });
}
