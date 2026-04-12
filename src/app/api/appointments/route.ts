import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createBookingCheckout } from "@/lib/stripe";

const createSchema = z.object({
  serviceId: z.string().cuid(),
  stylistId: z.string().nullable(),
  scheduledAt: z.string().datetime(),
  notes: z.string().max(1000).optional(),
});

// POST /api/appointments — create appointment + Stripe checkout
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await req.json() as unknown;
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides", details: parsed.error.flatten() }, { status: 400 });
  }

  const { serviceId, stylistId, scheduledAt, notes } = parsed.data;

  // Validate service exists
  const service = await prisma.service.findUnique({ where: { id: serviceId, isActive: true } });
  if (!service) {
    return NextResponse.json({ error: "Service introuvable" }, { status: 404 });
  }

  const scheduledDate = new Date(scheduledAt);
  const dayOfWeek = scheduledDate.getDay();
  const endTime = new Date(scheduledDate.getTime() + service.durationMins * 60_000);

  // Resolve target stylists
  let targetStylistIds: string[] = [];
  if (!stylistId || stylistId === "any") {
    // Find all active stylists who work on this day
    const availableStylists = await prisma.availability.findMany({
      where: { dayOfWeek, isActive: true, stylist: { isActive: true } },
      select: { stylistId: true },
    });
    targetStylistIds = Array.from(new Set(availableStylists.map(a => a.stylistId)));
    
    if (targetStylistIds.length === 0) {
      return NextResponse.json({ error: "Aucun styliste n'est disponible ce jour-là" }, { status: 400 });
    }
  } else {
    const stylist = await prisma.stylist.findUnique({ where: { id: stylistId, isActive: true } });
    if (!stylist) {
      return NextResponse.json({ error: "Styliste introuvable" }, { status: 404 });
    }
    targetStylistIds = [stylist.id];
  }

  // Find the first stylist without conflicts
  let resolvedStylistId: string | null = null;

  for (const tId of targetStylistIds) {
    // Check appointments
    const conflict = await prisma.appointment.findFirst({
      where: {
        stylistId: tId,
        status: { in: ["CONFIRMED", "ACCEPTED"] },
        scheduledAt: { lt: endTime },
        AND: [
          {
            scheduledAt: {
              gte: new Date(scheduledDate.getTime() - service.durationMins * 60_000),
            },
          },
        ],
      },
    });

    if (conflict) continue;

    // Check block slots
    const blocked = await prisma.blockedSlot.findFirst({
      where: {
        stylistId: tId,
        date: { equals: new Date(scheduledDate.toISOString().split("T")[0]!) },
      },
    });

    if (blocked) {
      const dateStr = scheduledDate.toISOString().split("T")[0];
      const blockStart = new Date(`${dateStr}T${blocked.startTime}:00Z`);
      const blockEnd = new Date(`${dateStr}T${blocked.endTime}:00Z`);
      if (scheduledDate < blockEnd && endTime > blockStart) {
        continue;
      }
    }

    // No conflicts found for this stylist
    resolvedStylistId = tId;
    break;
  }

  if (!resolvedStylistId) {
    return NextResponse.json({ error: "Ce créneau n'est plus disponible (conflit d'horaire)" }, { status: 409 });
  }

  const totalPrice = service.basePrice;
  const depositPct = service.depositPct;
  const depositAmount = parseFloat(totalPrice.toString()) * (depositPct / 100);
  const depositCents = Math.round(depositAmount * 100);

  // Create appointment in PENDING state
  const appointment = await prisma.appointment.create({
    data: {
      clientId: session.user.id,
      stylistId: resolvedStylistId,
      serviceId,
      scheduledAt: scheduledDate,
      durationMins: service.durationMins,
      totalPrice,
      depositAmount: depositAmount.toFixed(2),
      depositPct,
      notes,
      status: "PENDING",
    },
    include: {
      service: true,
      stylist: { include: { user: true } },
    },
  });

  // Create Stripe checkout
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const stripeSession = await createBookingCheckout({
    appointmentId: appointment.id,
    serviceName: service.name,
    stylistName: appointment.stylist.user.name ?? "Styliste",
    totalAmountCents: Math.round(parseFloat(totalPrice.toString()) * 100),
    depositPercent: depositPct,
    clientEmail: session.user.email,
    successUrl: `${baseUrl}/booking/success?appointmentId=${appointment.id}`,
    cancelUrl: `${baseUrl}/booking?cancelled=true`,
  });

  // Store stripe session ID
  await prisma.appointment.update({
    where: { id: appointment.id },
    data: { stripeSessionId: stripeSession.id },
  });

  return NextResponse.json({ checkoutUrl: stripeSession.url, appointmentId: appointment.id });
}

// GET /api/appointments — list client's appointments
export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const appointments = await prisma.appointment.findMany({
    where: {
      clientId: session.user.role === "ADMIN" ? undefined : session.user.id,
    },
    include: {
      client: { select: { name: true, email: true } },
      service: { select: { name: true } },
      stylist: { include: { user: { select: { name: true } } } },
      payment: { select: { status: true, amount: true } },
    },
    orderBy: { scheduledAt: "desc" },
    take: 100,
  });

  const serialized = appointments.map((a) => ({
    ...a,
    totalPrice: parseFloat(a.totalPrice.toString()),
    depositAmount: parseFloat(a.depositAmount.toString()),
  }));

  return NextResponse.json({ appointments: serialized });
}
