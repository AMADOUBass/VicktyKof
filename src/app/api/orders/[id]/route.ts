import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { id } = await params;
  const { status, trackingNumber } = await req.json() as { status?: string; trackingNumber?: string };

  try {
    const updated = await prisma.order.update({
      where: { id },
      data: {
        ...(status && { status: status as never }),
        ...(trackingNumber !== undefined && { trackingNumber }),
      },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}
