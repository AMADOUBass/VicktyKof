import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendRawEmail } from "@/lib/email";

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(10).max(2000),
});

export async function POST(req: NextRequest) {
  const body = await req.json() as unknown;
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const { name, email, subject, message } = parsed.data;

  try {
    await sendRawEmail({
      to: "vicktykoff@gmail.com",
      subject: `[VicktyKof Contact] ${subject} — ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;background:#0A0A0A;color:#F5EDD6;padding:32px;border-radius:12px;border:1px solid #C9A84C33;">
          <h2 style="color:#C9A84C;margin-top:0;">Nouveau message de contact</h2>
          <p><strong>De :</strong> ${name} (${email})</p>
          <p><strong>Sujet :</strong> ${subject}</p>
          <hr style="border-color:#333;margin:24px 0;">
          <div style="line-height:1.6;font-size:15px;">
            ${message.replace(/\n/g, "<br>")}
          </div>
          <hr style="border-color:#333;margin:24px 0;">
          <p style="font-size:12px;color:#6B6B6B;">Vous pouvez répondre directement à cet email pour contacter la cliente.</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("[contact-api] Email failed:", err);
  }

  return NextResponse.json({ success: true });
}
