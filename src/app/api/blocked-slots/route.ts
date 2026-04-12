import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const createBlockedSlotSchema = z.object({
  date: z.string(), // YYYY-MM-DD
  startTime: z.string(), // HH:mm
  endTime: z.string(),   // HH:mm
  reason: z.string().max(200).optional(),
});

// GET /api/blocked-slots?stylistId=...
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const stylistId = searchParams.get("stylistId");
  if (!stylistId) return NextResponse.json({ error: "stylistId requis" }, { status: 400 });

  const slots = await prisma.blockedSlot.findMany({
    where: { stylistId },
    orderBy: { date: "asc" },
  });

  return NextResponse.json(slots.map((s) => ({
    ...s,
    date: s.date.toISOString().split("T")[0],
  })));
}

// POST /api/blocked-slots — create a blocked slot (stylist or admin)
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const body = await req.json() as unknown;
  const parsed = createBlockedSlotSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Données invalides" }, { status: 400 });

  // Find the stylist profile for this user
  const stylist = await prisma.stylist.findUnique({ where: { userId: session.user.id } });
  if (!stylist && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Profil styliste introuvable" }, { status: 403 });
  }

  const stylistId = stylist?.id;
  if (!stylistId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const slot = await prisma.blockedSlot.create({
    data: {
      stylistId,
      date: new Date(parsed.data.date),
      startTime: parsed.data.startTime,
      endTime: parsed.data.endTime,
      reason: parsed.data.reason,
    },
  });

  return NextResponse.json({
    ...slot,
    date: slot.date.toISOString().split("T")[0],
  }, { status: 201 });
}

// DELETE /api/blocked-slots?id=...
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id requis" }, { status: 400 });

  const slot = await prisma.blockedSlot.findUnique({ where: { id } });
  if (!slot) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  // Check ownership
  if (session.user.role !== "ADMIN") {
    const stylist = await prisma.stylist.findUnique({ where: { userId: session.user.id } });
    if (!stylist || stylist.id !== slot.stylistId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  await prisma.blockedSlot.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
