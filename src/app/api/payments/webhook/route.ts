import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type Stripe from "stripe";

// Stripe requires the raw body for signature verification
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const { type, appointmentId, orderId } = session.metadata ?? {};

        if (type === "APPOINTMENT_DEPOSIT" && appointmentId) {
          await handleAppointmentDeposit(session, appointmentId);
        } else if (type === "PRODUCT_ORDER" && orderId) {
          await handleProductOrder(session, orderId);
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;
        const appointmentId = pi.metadata?.appointmentId;
        if (appointmentId) {
          await prisma.appointment.update({
            where: { id: appointmentId },
            data: { status: "CANCELLED" },
          });
        }
        break;
      }
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function handleAppointmentDeposit(session: Stripe.Checkout.Session, appointmentId: string) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      client: true,
      service: true,
      stylist: { include: { user: true } },
    },
  });

  if (!appointment) return;

  // Record payment
  await prisma.payment.create({
    data: {
      appointmentId,
      stripePaymentId: session.payment_intent as string,
      amount: (session.amount_total ?? 0) / 100,
      currency: session.currency ?? "cad",
      status: "SUCCEEDED",
      metadata: { stripeSessionId: session.id },
    },
  });

  // Update appointment to CONFIRMED (waiting for admin acceptance)
  await prisma.appointment.update({
    where: { id: appointmentId },
    data: { status: "CONFIRMED" },
  });

  // Send confirmation email to client
  await sendEmail({
    to: appointment.client.email!,
    template: "appointment_confirmed",
    data: {
      clientName: appointment.client.name ?? "Cliente",
      serviceName: appointment.service.name,
      stylistName: appointment.stylist.user.name ?? "Styliste",
      appointmentDate: format(appointment.scheduledAt, "EEEE d MMMM yyyy 'à' HH:mm", { locale: fr }),
      depositAmount: formatPrice((session.amount_total ?? 0) / 100),
      remainingAmount: formatPrice(
        parseFloat(appointment.totalPrice.toString()) - parseFloat(appointment.depositAmount.toString())
      ),
    },
  });
}

async function handleProductOrder(session: Stripe.Checkout.Session, orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { user: true },
  });

  if (!order) return;

  await prisma.payment.create({
    data: {
      orderId,
      stripePaymentId: session.payment_intent as string,
      amount: (session.amount_total ?? 0) / 100,
      currency: session.currency ?? "cad",
      status: "SUCCEEDED",
    },
  });

  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "PROCESSING",
      // Capture shipping from session
      shippingAddress: session.shipping_details
        ? ({
            name: session.shipping_details.name,
            address: session.shipping_details.address,
          } as unknown as import("@prisma/client").Prisma.InputJsonValue)
        : undefined,
    },
  });
}
