import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/products?category=...&featured=true&page=1
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const featured = searchParams.get("featured") === "true";
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = parseInt(searchParams.get("limit") ?? "12", 10);

  const session = await auth();
  const isMember = session?.user.isMember ?? false;

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(category ? { category: { slug: category } } : {}),
      ...(featured ? { isFeatured: true } : {}),
      // Hide member-only products from non-members
      ...(isMember ? {} : { isMemberOnly: false }),
    },
    include: {
      category: { select: { name: true, slug: true } },
    },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    skip: (page - 1) * limit,
    take: limit,
  });

  const total = await prisma.product.count({
    where: {
      isActive: true,
      ...(category ? { category: { slug: category } } : {}),
      ...(isMember ? {} : { isMemberOnly: false }),
    },
  });

  // Apply member pricing
  const enriched = products.map((p) => ({
    ...p,
    displayPrice: isMember && p.memberPrice ? p.memberPrice : p.price,
    isMemberDiscount: isMember && !!p.memberPrice,
  }));

  return NextResponse.json({ products: enriched, total, page, pages: Math.ceil(total / limit) });
}

// POST /api/products — admin only
const createSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
  description: z.string().optional(),
  price: z.number().positive(),
  comparePrice: z.number().positive().optional(),
  stock: z.number().int().min(0),
  categoryId: z.string().cuid(),
  images: z.array(z.string().url()).min(1),
  isFeatured: z.boolean().default(false),
  isMemberOnly: z.boolean().default(false),
  memberPrice: z.number().positive().optional(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json() as unknown;
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 });
  }

  const product = await prisma.product.create({ data: parsed.data });
  return NextResponse.json(product, { status: 201 });
}
