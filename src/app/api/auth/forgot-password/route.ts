import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { sendRawEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json() as { email: string };
    if (!email) return NextResponse.json({ error: "Email requis" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });

    // Always respond 200 to prevent email enumeration
    if (!user || !user.passwordHash) {
      return NextResponse.json({ ok: true });
    }

    // Invalidate previous tokens
    await prisma.passwordResetToken.deleteMany({ where: { email } });

    // Create new token (expires in 1 hour)
    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    await prisma.passwordResetToken.create({ data: { email, token, expires } });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

    await sendRawEmail({
      to: email,
      subject: "Réinitialisation de votre mot de passe — VicktyKof",
      html: `
        <div style="font-family:sans-serif;max-width:500px;margin:auto;padding:24px">
          <h2 style="color:#C9A84C">VicktyKof</h2>
          <p>Bonjour,</p>
          <p>Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte.</p>
          <a href="${resetUrl}" style="display:inline-block;margin:16px 0;padding:12px 24px;background:#C9A84C;color:#111;font-weight:bold;border-radius:8px;text-decoration:none">
            Réinitialiser mon mot de passe
          </a>
          <p style="color:#888;font-size:13px">Ce lien expire dans <strong>1 heure</strong>. Si vous n'avez pas fait cette demande, ignorez cet email.</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[forgot-password]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
