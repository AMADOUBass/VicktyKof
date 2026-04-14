import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json() as { email: string };
    if (!email) return NextResponse.json({ error: "Email requis" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });

    // Safety check: if user doesn't exist, we skip silently for security (avoid enumeration)
    if (!user) {
      return NextResponse.json({ ok: true });
    }

    // Google Account detection: send a reminder instead of a reset link
    if (!user.passwordHash) {
      try {
        await sendEmail({
          to: email,
          template: "google_signin_reminder",
          data: {},
        });
      } catch (err) {
        console.error("[forgot-password] Google reminder failed:", err);
      }
      return NextResponse.json({ ok: true });
    }

    // Invalidate previous tokens
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
