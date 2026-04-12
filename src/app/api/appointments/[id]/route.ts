import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { refundPayment } from "@/lib/stripe";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const adminSchema = z.object({
  status: z.enum(["ACCEPTED", "DECLINED", "CANCELLED", "COMPLETED", "CONFIRMED"]),
  adminNotes: z.string().optional(),
  cancelReason: z.string().optional(),
});

const stylistSchema = z.object({
  status: z.enum(["COMPLETED", "CANCELLED"]),
  adminNotes: z.string().optional(),
});

const clientCancelSchema = z.object({
  status: z.literal("CANCELLED"),
  cancelReason: z.string().min(1, "Une raison est requise"),
});

const clientRescheduleSchema = z.object({
  status: z.literal("RESCHEDULED"),
  scheduledAt: z.string().datetime(),
});

// PATCH /api/appointments/[id] — admin + stylist (limited) + client (cancel only)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const isAdmin = session.user.role === "ADMIN";
  const isStylist = session.user.role === "STYLIST";
  const isClient = session.user.role === "CLIENT";

  if (!isAdmin && !isStylist && !isClient) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json() as unknown;

  // Pick the right schema based on role
  let parsed;
  if (isAdmin) {
    parsed = adminSchema.safeParse(body);
  } else if (isStylist) {
    parsed = stylistSchema.safeParse(body);
  } else {
    // Try cancel first, then reschedule
    const cancelParsed = clientCancelSchema.safeParse(body);
    parsed = cancelParsed.success ? cancelParsed : clientRescheduleSchema.safeParse(body);
  }
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const { status } = parsed.data;
  const adminNotes = "adminNotes" in parsed.data ? parsed.data.adminNotes : undefined;
  const cancelReason = "cancelReason" in parsed.data ? parsed.data.cancelReason : undefined;

  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: {
      client: true,
      service: true,
      stylist: { include: { user: true } },
      payment: true,
    },
  });

  if (!appointment) {
    return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  }

  // Client can only modify their own appointments in a modifiable state
  if (isClient) {
    if (appointment.clientId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (!["PENDING", "CONFIRMED", "ACCEPTED"].includes(appointment.status)) {
      return NextResponse.json({ error: "Ce rendez-vous ne peut plus être modifié" }, { status: 400 });
    }
  }

  // Stylist can only update their own appointments
  if (isStylist) {
    const stylist = await prisma.stylist.findUnique({ where: { userId: session.user.id } });
    if (!stylist || stylist.id !== appointment.stylistId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  // Build update data
  const updateData: Record<string, unknown> = { status, adminNotes, cancelReason };
  if (status === "RESCHEDULED" && "scheduledAt" in parsed.data) {
    updateData.rescheduleFrom = appointment.scheduledAt;
    updateData.scheduledAt = new Date(parsed.data.scheduledAt as string);
    updateData.status = "PENDING"; // Reset status so admin re-confirms
  }

  const updated = await prisma.appointment.update({
    where: { id },
    data: updateData,
  });

  const dateStr = format(appointment.scheduledAt, "EEEE d MMMM yyyy 'à' HH:mm", { locale: fr });

  // Send appropriate email
  if (status === "ACCEPTED") {
    await sendEmail({
      to: appointment.client.email!,
      template: "appointment_accepted",
      data: {
        clientName: appointment.client.name ?? "Cliente",
        serviceName: appointment.service.name,
        stylistName: appointment.stylist.user.name ?? "Styliste",
        appointmentDate: dateStr,
      },
    });
  }

  if (status === "DECLINED") {
    // Refund deposit if payment exists
    if (appointment.payment?.stripePaymentId) {
      try {
        await refundPayment(appointment.payment.stripePaymentId);
        await prisma.payment.update({
          where: { id: appointment.payment.id },
          data: { status: "REFUNDED" },
        });
      } catch (err) {
        console.error("Refund failed:", err);
      }
    }

    await sendEmail({
      to: appointment.client.email!,
      template: "appointment_declined",
      data: {
        clientName: appointment.client.name ?? "Cliente",
        appointmentDate: dateStr,
        reason: cancelReason ?? "Créneau non disponible",
        depositAmount: formatPrice(parseFloat(appointment.depositAmount.toString())),
      },
    });
  }

  return NextResponse.json(updated);
}
