import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const photos = await prisma.galleryPhoto.findMany({
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });
  return NextResponse.json({ photos });
}

const createSchema = z.object({
  url: z.string().url(),
  caption: z.string().optional(),
  altText: z.string().optional(),
  tags: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || !["ADMIN", "STYLIST"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json() as unknown;
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const photo = await prisma.galleryPhoto.create({
    data: { ...parsed.data, uploadedBy: session.user.id },
  });

  return NextResponse.json(photo, { status: 201 });
}
