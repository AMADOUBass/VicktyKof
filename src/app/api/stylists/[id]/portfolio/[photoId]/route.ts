import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteParams = { params: Promise<{ id: string; photoId: string }> };

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { id, photoId } = await params;
  const stylist = await prisma.stylist.findUnique({ where: { id } });
  if (!stylist) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  const isOwner = stylist.userId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";
  if (!isOwner && !isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.portfolioPhoto.delete({ where: { id: photoId, stylistId: id } });
  return NextResponse.json({ success: true });
}
