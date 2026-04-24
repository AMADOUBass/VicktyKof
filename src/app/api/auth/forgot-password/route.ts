import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { sendEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  // 3 tentatives par heure par IP pour éviter l'énumération d'emails
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  if (!rateLimit(`forgot:${ip}`, 3, 60 * 60 * 1000)) {
    return NextResponse.json({ ok: true }); // Silencieux pour ne pas exposer le rate limit
  }

  try {
    const { email } = await req.json() as { email: string };
    if (!email) return NextResponse.json({ error: "Email requis" }, { status: 400 });

    // Délai minimum constant pour éviter le timing attack (énumération d'emails)
    const minDelay = new Promise((r) => setTimeout(r, 200 + Math.random() * 100));

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      await minDelay;
      return NextResponse.json({ ok: true });
    }

    // Google Account detection: send a reminder instead of a reset link
    if (!user.passwordHash) {
      await minDelay;
      try {
        await sendEmail({ to: email, template: "google_signin_reminder", data: {} });
      } catch (err) {
        console.error("[forgot-password] Google reminder failed:", err);
      }
      return NextResponse.json({ ok: true });
    }

    // Invalidate previous tokens
    await minDelay;
    await prisma.passwordResetToken.deleteMany({ where: { email } });

    // Create new token (expires in 1 hour)
    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    await prisma.passwordResetToken.create({ data: { email, token, expires } });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

    try {
      await sendEmail({
        to: email,
        template: "reset_password",
        data: { resetUrl },
      });
    } catch (emailErr) {
      console.error("[forgot-password] Email failed:", emailErr);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[forgot-password]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
