import { NextResponse } from "next/server";

// Ce endpoint est déprécié. Le webhook Stripe canonique est /api/webhooks/stripe
// Mettre à jour l'URL dans le dashboard Stripe : https://dashboard.stripe.com/webhooks
export async function POST() {
  return NextResponse.json(
    { error: "Deprecated. Use /api/webhooks/stripe" },
    { status: 410 }
  );
}
