import { NextRequest, NextResponse } from "next/server";
import { sendRawEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    // On envoie le test à l'adresse du développeur comme demandé
    const testEmail = "bassoumamadou00@gmail.com";
    
    await sendRawEmail({
      to: testEmail,
      subject: "VicktyKof — Test de Notification",
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0A0A0A;color:#F5EDD6;padding:40px;border-radius:12px;border:1px solid #C9A84C33;">
          <h1 style="color:#C9A84C;">Test de Connexion ✅</h1>
          <p>Ceci est un email de test pour valider votre configuration SMTP.</p>
          <p style="color:#6B6B6B;font-size:12px;">Envoyé le : ${new Date().toLocaleString()}</p>
          <p style="font-size:12px;color:#6B6B6B;">Ce test a été envoyé à ${testEmail}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Test email error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur lors de l'envoi" },
      { status: 500 }
    );
  }
}
