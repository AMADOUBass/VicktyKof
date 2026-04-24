import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createBookingCheckout } from "@/lib/stripe";
import type { Prisma } from "@prisma/client";

type AppointmentWithRelations = Prisma.AppointmentGetPayload<{
  include: { service: true; stylist: { include: { user: true } } };
}>;

const createSchema = z.object({
  serviceId: z.string().cuid(),
  stylistId: z.string().nullable(),
  scheduledAt: z.string().datetime(),
  notes: z.string().max(1000).optional(),
  paymentMethod: z.enum(["CARD", "INTERAC"]).default("CARD"),
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

  const { serviceId, stylistId, scheduledAt, notes, paymentMethod } = parsed.data;

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

  // Calculs monétaires en centimes pour éviter les erreurs d'arrondi float
  const subtotalCents = Math.round(parseFloat(service.basePrice.toString()) * 100);
  const taxCents = Math.round(subtotalCents * 0.14975);
  const totalCents = subtotalCents + taxCents;
  const depositPct = service.depositPct;
  const depositCents = Math.round(totalCents * depositPct / 100);

  const totalPrice = (totalCents / 100).toFixed(2);
  const depositAmount = (depositCents / 100).toFixed(2);

  // Vérification de conflit + création dans une seule transaction atomique
  // pour éviter les race conditions (deux clients qui réservent le même créneau)
  let appointment: AppointmentWithRelations | null = null;

  for (const tId of targetStylistIds) {
    try {
      appointment = await prisma.$transaction(async (tx) => {
        const conflict = await tx.appointment.findFirst({
          where: {
            stylistId: tId,
            status: { in: ["CONFIRMED", "ACCEPTED"] },
            scheduledAt: { lt: endTime },
            AND: [{ scheduledAt: { gte: new Date(scheduledDate.getTime() - service.durationMins * 60_000) } }],
          },
        });
        if (conflict) throw new Error("CONFLICT");

        const blocked = await tx.blockedSlot.findFirst({
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
            throw new Error("CONFLICT");
          }
        }

        return tx.appointment.create({
          data: {
            clientId: session.user.id,
            stylistId: tId,
            serviceId,
            scheduledAt: scheduledDate,
            durationMins: service.durationMins,
            totalPrice,
            depositAmount,
            depositPct,
            paymentMethod,
            notes,
            status: "PENDING",
          },
          include: {
            service: true,
            stylist: { include: { user: true } },
          },
        });
      });
      break;
    } catch (err) {
      if (err instanceof Error && err.message === "CONFLICT") continue;
      throw err;
    }
  }

  if (!appointment) {
    return NextResponse.json({ error: "Ce créneau n'est plus disponible (conflit d'horaire)" }, { status: 409 });
  }

  if (paymentMethod === "INTERAC") {
    const { formatPrice } = await import("@/lib/utils");
    const { sendEmail } = await import("@/lib/email");
    const { format } = await import("date-fns");
    const { fr } = await import("date-fns/locale");

    await sendEmail({
      to: session.user.email!,
      template: "appointment_pending_interac",
      data: {
        clientName: session.user.name ?? "Cliente",
        serviceName: service.name,
        stylistName: appointment.stylist.user.name ?? "Styliste",
        appointmentDate: format(appointment.scheduledAt, "EEEE d MMMM yyyy 'à' HH:mm", { locale: fr }),
        depositAmount: formatPrice(parseFloat(appointment.depositAmount.toString())),
      },
    });

    return NextResponse.json({ success: true, appointmentId: appointment.id });
  }

  // Create Stripe checkout
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const stripeSession = await createBookingCheckout({
    appointmentId: appointment.id,
    serviceName: service.name,
    stylistName: appointment.stylist.user.name ?? "Styliste",
    totalAmountCents: totalCents,
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
