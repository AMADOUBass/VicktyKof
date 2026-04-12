import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

type EmailTemplate =
  | "appointment_pending_interac"
  | "appointment_confirmed"
  | "appointment_accepted"
  | "appointment_declined"
  | "appointment_reminder"
  | "order_shipped"
  | "welcome";

interface SendEmailOptions {
  to: string;
  template: EmailTemplate;
  data: Record<string, string | number>;
}

const templates: Record<EmailTemplate, (data: Record<string, string | number>) => { subject: string; html: string }> = {
  appointment_confirmed: (d) => ({
    subject: "VicktyKof — Votre dépôt a été reçu ✓",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0A0A0A;color:#F5EDD6;padding:40px;border-radius:12px;">
        <h1 style="color:#C9A84C;font-size:24px;margin-bottom:8px;">VicktyKof</h1>
        <p style="color:#6B6B6B;font-size:12px;margin-bottom:32px;">Salon spécialisé en locs et coiffures afro</p>
        <h2 style="font-size:20px;">Dépôt reçu — Confirmation en cours</h2>
        <p>Bonjour <strong>${d.clientName}</strong>,</p>
        <p>Nous avons bien reçu votre dépôt de <strong>${d.depositAmount} CAD</strong> pour votre rendez-vous.</p>
        <div style="background:#1A1A1A;border:1px solid #C9A84C33;border-radius:8px;padding:20px;margin:24px 0;">
          <p style="margin:4px 0;"><strong>Service :</strong> ${d.serviceName}</p>
          <p style="margin:4px 0;"><strong>Styliste :</strong> ${d.stylistName}</p>
          <p style="margin:4px 0;"><strong>Date :</strong> ${d.appointmentDate}</p>
          <p style="margin:4px 0;"><strong>Solde restant :</strong> ${d.remainingAmount} CAD (à payer au salon)</p>
        </div>
        <p>Notre équipe va confirmer votre rendez-vous sous peu. Vous recevrez un email de confirmation.</p>
        <hr style="border-color:#333;margin:32px 0;">
        <p style="font-size:12px;color:#6B6B6B;">2177 rue du Carrousel, Québec G2B 5B5 · (581) 745-7409</p>
      </div>
    `,
  }),
  appointment_pending_interac: (d) => ({
    subject: "VicktyKof — En attente de votre virement Interac ⌛",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0A0A0A;color:#F5EDD6;padding:40px;border-radius:12px;border:1px solid #C9A84C33;">
        <h1 style="color:#C9A84C;font-size:24px;margin-bottom:8px;">VicktyKof</h1>
        <p style="color:#6B6B6B;font-size:12px;margin-bottom:32px;">Action requise pour confirmer votre RDV</p>
        
        <h2>Presque terminé !</h2>
        <p>Bonjour <strong>${d.clientName}</strong>,</p>
        <p>Nous avons bien reçu votre demande de réservation. Pour la valider, veuillez effectuer votre virement Interac :</p>
        
        <div style="background:#1A1A1A;border:1px solid #C9A84C33;border-radius:8px;padding:20px;margin:24px 0;">
          <p style="margin:4px 0;"><strong>Montant du d\u00e9p\u00f4t :</strong> <span style="color:#C9A84C;font-size:18px;">${d.depositAmount} CAD</span></p>
          <p style="margin:4px 0;"><strong>Email pour le virement :</strong> <strong style="color:#F5EDD6;">VictyKof@yahoo.fr</strong></p>
          <p style="margin:4px 0;font-size:12px;color:#6B6B6B;">(Veuillez inclure votre nom dans les notes du virement)</p>
        </div>

        <div style="font-size:14px;color:#brand-muted;">
          <p><strong>D\u00e9tails du RDV :</strong></p>
          <p>${d.serviceName} avec ${d.stylistName}<br>${d.appointmentDate}</p>
        </div>

        <p style="margin-top:24px;">Une fois le virement reçu, vous recevrez un email de confirmation finale.</p>
        <hr style="border-color:#333;margin:32px 0;">
        <p style="font-size:12px;color:#6B6B6B;">2177 rue du Carrousel, Québec G2B 5B5</p>
      </div>
    `,
  }),

  appointment_accepted: (d) => ({
    subject: "VicktyKof — Rendez-vous confirmé ✓",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0A0A0A;color:#F5EDD6;padding:40px;border-radius:12px;">
        <h1 style="color:#C9A84C;">VicktyKof</h1>
        <h2>Votre rendez-vous est confirmé !</h2>
        <p>Bonjour <strong>${d.clientName}</strong>, votre rendez-vous avec <strong>${d.stylistName}</strong> est officiel.</p>
        <div style="background:#1A1A1A;border:1px solid #C9A84C33;border-radius:8px;padding:20px;margin:24px 0;">
          <p><strong>Service :</strong> ${d.serviceName}</p>
          <p><strong>Date :</strong> ${d.appointmentDate}</p>
          <p><strong>Adresse :</strong> 2177 rue du Carrousel, Québec G2B 5B5</p>
        </div>
        <p style="font-size:12px;color:#6B6B6B;">2177 rue du Carrousel, Québec G2B 5B5 · (581) 745-7409</p>
      </div>
    `,
  }),

  appointment_declined: (d) => ({
    subject: "VicktyKof — Mise à jour de votre rendez-vous",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0A0A0A;color:#F5EDD6;padding:40px;border-radius:12px;">
        <h1 style="color:#C9A84C;">VicktyKof</h1>
        <h2>Rendez-vous non disponible</h2>
        <p>Bonjour <strong>${d.clientName}</strong>,</p>
        <p>Malheureusement, nous ne pouvons pas confirmer votre rendez-vous du <strong>${d.appointmentDate}</strong>.</p>
        <p><strong>Raison :</strong> ${d.reason}</p>
        <p>Votre dépôt de <strong>${d.depositAmount} CAD</strong> sera remboursé intégralement dans 3-5 jours ouvrables.</p>
        <p>Veuillez nous contacter pour reprogrammer : <a href="tel:+15817457409" style="color:#C9A84C;">(581) 745-7409</a></p>
      </div>
    `,
  }),

  appointment_reminder: (d) => ({
    subject: `VicktyKof — Rappel : demain à ${d.appointmentTime}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0A0A0A;color:#F5EDD6;padding:40px;border-radius:12px;">
        <h1 style="color:#C9A84C;">VicktyKof</h1>
        <h2>Rappel de rendez-vous</h2>
        <p>Bonjour <strong>${d.clientName}</strong>, votre rendez-vous est demain !</p>
        <div style="background:#1A1A1A;border:1px solid #C9A84C33;border-radius:8px;padding:20px;margin:24px 0;">
          <p><strong>Heure :</strong> ${d.appointmentTime}</p>
          <p><strong>Service :</strong> ${d.serviceName}</p>
          <p><strong>Styliste :</strong> ${d.stylistName}</p>
          <p><strong>Solde à payer :</strong> ${d.remainingAmount} CAD</p>
        </div>
      </div>
    `,
  }),

  order_shipped: (d) => ({
    subject: "VicktyKof — Votre commande est en chemin !",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0A0A0A;color:#F5EDD6;padding:40px;border-radius:12px;">
        <h1 style="color:#C9A84C;">VicktyKof</h1>
        <h2>Commande expédiée</h2>
        <p>Bonjour <strong>${d.clientName}</strong>, votre commande <strong>#${d.orderId}</strong> a été expédiée.</p>
        <p><strong>Numéro de suivi :</strong> ${d.trackingNumber}</p>
      </div>
    `,
  }),

  welcome: (d) => ({
    subject: "Bienvenue chez VicktyKof ✨",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0A0A0A;color:#F5EDD6;padding:40px;border-radius:12px;">
        <h1 style="color:#C9A84C;">VicktyKof</h1>
        <h2>Bienvenue, <strong>${d.name}</strong> !</h2>
        <p>Nous sommes ravis de vous accueillir au salon VicktyKof — votre destination premium pour les locs et coiffures afro.</p>
        <p>Prenez rendez-vous dès maintenant et découvrez l'excellence de notre équipe.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/booking" style="display:inline-block;background:#C9A84C;color:#0A0A0A;padding:14px 28px;border-radius:6px;text-decoration:none;font-weight:bold;margin-top:16px;">
          Réserver maintenant
        </a>
      </div>
    `,
  }),
};

export async function sendEmail({ to, template, data }: SendEmailOptions) {
  const { subject, html } = templates[template](data);

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });

    await prisma.emailLog.create({
      data: { to, subject, template, metadata: data },
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    await prisma.emailLog.create({
      data: { to, subject, template, metadata: data, error: errMsg },
    });
    throw error;
  }
}

// Raw email helper (no template required)
export async function sendRawEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  await transporter.sendMail({ from: process.env.EMAIL_FROM, to, subject, html });
}
