import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(10).max(2000),
});

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

export async function POST(req: NextRequest) {
  const body = await req.json() as unknown;
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const { name, email, subject, message } = parsed.data;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: "vicktykoff@gmail.com",
    replyTo: email,
    subject: `[VicktyKof Contact] ${subject} — ${name}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;background:#0A0A0A;color:#F5EDD6;padding:32px;border-radius:12px;">
        <h2 style="color:#C9A84C;">Nouveau message de contact</h2>
        <p><strong>De :</strong> ${name} (${email})</p>
        <p><strong>Sujet :</strong> ${subject}</p>
        <hr style="border-color:#333;margin:16px 0;">
        <p>${message.replace(/\n/g, "<br>")}</p>
      </div>
    `,
  });

  return NextResponse.json({ success: true });
}
