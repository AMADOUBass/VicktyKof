import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteParams = { params: Promise<{ id: string }> };

const createSchema = z.object({
  url: z.string().url(),
  caption: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

export async function POST(req: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { id } = await params;
  const stylist = await prisma.stylist.findUnique({ where: { id } });
  if (!stylist) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  const isOwner = stylist.userId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";
  if (!isOwner && !isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json() as unknown;
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Données invalides" }, { status: 400 });

  const photo = await prisma.portfolioPhoto.create({
    data: { stylistId: id, ...parsed.data },
  });
  return NextResponse.json(photo, { status: 201 });
}
