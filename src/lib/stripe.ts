import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});

export const DEPOSIT_PERCENT = parseInt(process.env.STRIPE_DEPOSIT_PERCENT ?? "30", 10);

// ─── Booking deposit checkout ─────────────────────────────────────────────────

export async function createBookingCheckout({
  appointmentId,
  serviceName,
  stylistName,
  totalAmountCents,
  depositPercent,
  clientEmail,
  successUrl,
  cancelUrl,
}: {
  appointmentId: string;
  serviceName: string;
  stylistName: string;
  totalAmountCents: number;
  depositPercent: number;
  clientEmail: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const depositAmountCents = Math.round(totalAmountCents * (depositPercent / 100));

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: clientEmail,
    line_items: [
      {
        price_data: {
          currency: "cad",
          product_data: {
            name: `Dépôt — ${serviceName}`,
            description: `${depositPercent}% de dépôt avec ${stylistName}. Solde de ${((totalAmountCents - depositAmountCents) / 100).toFixed(2)} CAD payable au salon.`,
            images: [],
          },
          unit_amount: depositAmountCents,
        },
        quantity: 1,
      },
    ],
    metadata: {
      appointmentId,
      type: "APPOINTMENT_DEPOSIT",
      depositPercent: depositPercent.toString(),
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
    payment_intent_data: {
      metadata: { appointmentId, type: "APPOINTMENT_DEPOSIT" },
    },
  });

  return session;
}

// ─── Product checkout ─────────────────────────────────────────────────────────

export async function createProductCheckout({
  orderId,
  lineItems,
  clientEmail,
  successUrl,
  cancelUrl,
}: {
  orderId: string;
  lineItems: { name: string; description?: string; amountCents: number; quantity: number; imageUrl?: string }[];
  clientEmail: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: clientEmail,
    line_items: lineItems.map((item) => ({
      price_data: {
        currency: "cad",
        product_data: {
          name: item.name,
          description: item.description,
          images: item.imageUrl ? [item.imageUrl] : [],
        },
        unit_amount: item.amountCents,
      },
      quantity: item.quantity,
    })),
    metadata: { orderId, type: "PRODUCT_ORDER" },
    success_url: successUrl,
    cancel_url: cancelUrl,
    shipping_address_collection: {
      allowed_countries: ["CA"],
    },
  });

  return session;
}

// ─── Refund helper ────────────────────────────────────────────────────────────

export async function refundPayment(paymentIntentId: string, amountCents?: number) {
  return stripe.refunds.create({
    payment_intent: paymentIntentId,
    ...(amountCents ? { amount: amountCents } : {}),
  });
}
