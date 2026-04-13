import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

// Simple .env.local loader
const envLocalPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envLocalPath)) {
  const envFile = fs.readFileSync(envLocalPath, "utf-8");
  envFile.split("\n").forEach((line) => {
    const [key, ...valueParts] = line.split("=");
    if (key && valueParts.length > 0) {
      const value = valueParts.join("=").trim().replace(/^['"]|['"]$/g, "");
      process.env[key.trim()] = value;
    }
  });
}

async function testEmail() {
  console.log("Testing email with user:", process.env.SMTP_USER);
  
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.verify();
    console.log("✅ SMTP Connection successful!");

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.SMTP_USER, // send to self
      subject: "VicktyKof — Test de configuration email",
      html: `
        <div style="font-family:sans-serif;padding:20px;background:#0A0A0A;color:#F5EDD6;">
          <h1 style="color:#C9A84C;">Test Réussi !</h1>
          <p>Le système d'email de VicktyKof est maintenant configuré avec succès.</p>
          <p>Email utilisé : <strong>${process.env.SMTP_USER}</strong></p>
        </div>
      `,
    });

    console.log("✅ Email sent successfully:", info.messageId);
  } catch (error) {
    console.error("❌ Email test failed:", error);
    process.exit(1);
  }
}

testEmail();
