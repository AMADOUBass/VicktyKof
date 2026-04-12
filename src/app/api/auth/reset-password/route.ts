import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json() as { token: string; password: string };
    if (!token || !password) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Minimum 8 caractères" }, { status: 400 });
    }

    const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } });
    if (!resetToken || resetToken.used || resetToken.expires < new Date()) {
      return NextResponse.json({ error: "Lien invalide ou expiré" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.update({
      where: { email: resetToken.email },
      data: { passwordHash },
    });

    // Mark token used
    await prisma.passwordResetToken.update({ where: { token }, data: { used: true } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[reset-password]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
