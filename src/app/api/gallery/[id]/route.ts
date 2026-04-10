import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteParams = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session || !["ADMIN", "STYLIST"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const body = await req.json() as { isFeatured?: boolean; caption?: string; altText?: string; tags?: string[] };
  const photo = await prisma.galleryPhoto.update({ where: { id }, data: body });
  return NextResponse.json(photo);
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session || !["ADMIN", "STYLIST"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  await prisma.galleryPhoto.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
