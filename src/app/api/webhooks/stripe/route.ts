import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import type Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Webhook error: ${message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { type, orderId, appointmentId } = session.metadata ?? {};

    if (type === "PRODUCT_ORDER" && orderId) {
      await handleProductOrderPaid(session, orderId);
    } else if (type === "APPOINTMENT_DEPOSIT" && appointmentId) {
      await handleAppointmentDepositPaid(session, appointmentId);
    }
  }

  return NextResponse.json({ received: true });
}

async function handleProductOrderPaid(session: Stripe.Checkout.Session, orderId: string) {
  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? session.id;

  // Idempotent — skip if already processed
  const existing = await prisma.payment.findUnique({
    where: { stripePaymentId: paymentIntentId },
  });
  if (existing) return;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) return;

  await prisma.$transaction(async (tx) => {
    // 1. Update order status
    await tx.order.update({
      where: { id: orderId },
      data: {
        status: "PROCESSING",
        stripeSessionId: session.id,
        shippingAddress: session.shipping_details
          ? {
              name: session.shipping_details.name,
              line1: session.shipping_details.address?.line1,
              line2: session.shipping_details.address?.line2,
              city: session.shipping_details.address?.city,
              state: session.shipping_details.address?.state,
              postalCode: session.shipping_details.address?.postal_code,
              country: session.shipping_details.address?.country,
            }
          : undefined,
      },
    });

    // 2. Create payment record
    await tx.payment.create({
      data: {
        orderId,
        stripePaymentId: paymentIntentId,
        amount: (session.amount_total ?? 0) / 100,
        currency: session.currency ?? "cad",
        status: "SUCCEEDED",
        metadata: { stripeSessionId: session.id },
      },
    });

    // 3. Decrement stock
    for (const item of order.items) {
      const product = await tx.product.findUnique({
        where: { id: item.productId },
        select: { name: true, stock: true },
      });

      if (product && product.stock < item.quantity) {
        console.error(`[STOCK_CRITICAL] Order ${orderId} paid but stock insufficient for "${product.name}". Remaining: ${product.stock}, Wanted: ${item.quantity}`);
      }

      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }
  });
}

async function handleAppointmentDepositPaid(session: Stripe.Checkout.Session, appointmentId: string) {
  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? session.id;

  const existing = await prisma.payment.findUnique({
    where: { stripePaymentId: paymentIntentId },
  });
  if (existing) return;

  await prisma.$transaction([
    prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: "CONFIRMED",
        stripeSessionId: session.id,
      },
    }),
    prisma.payment.create({
      data: {
        appointmentId,
        stripePaymentId: paymentIntentId,
        amount: (session.amount_total ?? 0) / 100,
        currency: session.currency ?? "cad",
        status: "SUCCEEDED",
        metadata: { stripeSessionId: session.id },
      },
    }),
  ]);
}
