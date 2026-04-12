import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/membership — activate membership for the current user
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });

  if (user.isMember) {
    return NextResponse.json({ error: "Vous êtes déjà membre" }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      isMember: true,
      memberSince: new Date(),
    },
    select: { id: true, isMember: true, memberSince: true },
  });

  return NextResponse.json(updated);
}
