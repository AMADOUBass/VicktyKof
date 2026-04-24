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

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://vicktykof.beauty";

// Formate une date en heure locale de Québec (America/Toronto)
function formatDateQC(date: Date): string {
  return new Intl.DateTimeFormat("fr-CA", {
    timeZone: "America/Toronto",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

const UNSUBSCRIBE_FOOTER = `
  <hr style="border-color:#222;margin:32px 0;">
  <p style="font-size:11px;color:#555;text-align:center;line-height:1.6;">
    VicktyKof · 2177 rue du Carrousel, Québec G2B 5B5 · (581) 745-7409<br>
    Vous recevez cet email car vous avez un compte ou avez effectué une réservation.<br>
    <a href="${APP_URL}/account/notifications" style="color:#C9A84C;">Gérer vos préférences de notifications</a>
  </p>
`;

type EmailTemplate =
  | "appointment_pending_interac"
  | "appointment_confirmed"
  | "appointment_accepted"
  | "appointment_declined"
  | "appointment_reminder"
  | "order_shipped"
  | "welcome"
  | "reset_password"
  | "google_signin_reminder";

interface SendEmailOptions {
  to: string;
  template: EmailTemplate;
  data: Record<string, string | number | Date>;
}

const templates: Record<EmailTemplate, (data: Record<string, string | number | Date>) => { subject: string; html: string }> = {
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
          <p style="margin:4px 0;"><strong>Date :</strong> ${d.scheduledAt instanceof Date ? formatDateQC(d.scheduledAt) : d.appointmentDate}</p>
          <p style="margin:4px 0;"><strong>Solde restant :</strong> ${d.remainingAmount} CAD (à payer au salon)</p>
        </div>
        <p>Notre équipe va confirmer votre rendez-vous sous peu. Vous recevrez un email de confirmation.</p>
        ${UNSUBSCRIBE_FOOTER}
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
          <p style="margin:4px 0;"><strong>Montant du dépôt :</strong> <span style="color:#C9A84C;font-size:18px;">${d.depositAmount} CAD</span></p>
          <div style="margin-top:16px;padding-top:16px;border-top:1px solid #333;">
            <p style="margin:4px 0;"><strong>Option 1 — Par SMS (Recommandé) :</strong></p>
            <p style="margin:4px 0;color:#F5EDD6;font-size:16px;font-weight:bold;">(581) 745-7409</p>
            <p style="margin:16px 0 4px 0;"><strong>Option 2 — Par Courriel :</strong></p>
            <p style="margin:4px 0;color:#F5EDD6;font-size:16px;">vicktykoff@gmail.com</p>
          </div>
          <p style="margin:16px 0 0 0;font-size:12px;color:#6B6B6B;">(Note : Le dépôt automatique est activé sur les deux options)</p>
        </div>
        <div style="font-size:14px;">
          <p><strong>Détails du RDV :</strong></p>
          <p>${d.serviceName} avec ${d.stylistName}<br>${d.scheduledAt instanceof Date ? formatDateQC(d.scheduledAt) : d.appointmentDate}</p>
        </div>
        <p style="margin-top:24px;">Une fois le virement reçu, vous recevrez un email de confirmation finale.</p>
        ${UNSUBSCRIBE_FOOTER}
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
          <p><strong>Date :</strong> ${d.scheduledAt instanceof Date ? formatDateQC(d.scheduledAt) : d.appointmentDate}</p>
          <p><strong>Adresse :</strong> 2177 rue du Carrousel, Québec G2B 5B5</p>
        </div>
        ${UNSUBSCRIBE_FOOTER}
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
        <p>Malheureusement, nous ne pouvons pas confirmer votre rendez-vous du <strong>${d.scheduledAt instanceof Date ? formatDateQC(d.scheduledAt) : d.appointmentDate}</strong>.</p>
        <p><strong>Raison :</strong> ${d.reason}</p>
        <p>Votre dépôt de <strong>${d.depositAmount} CAD</strong> sera remboursé intégralement dans 3-5 jours ouvrables.</p>
        <p>Veuillez nous contacter pour reprogrammer : <a href="tel:+15817457409" style="color:#C9A84C;">(581) 745-7409</a></p>
        ${UNSUBSCRIBE_FOOTER}
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
        ${UNSUBSCRIBE_FOOTER}
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
        ${UNSUBSCRIBE_FOOTER}
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
        <a href="${APP_URL}/booking" style="display:inline-block;background:#C9A84C;color:#0A0A0A;padding:14px 28px;border-radius:6px;text-decoration:none;font-weight:bold;margin-top:16px;">
          Réserver maintenant
        </a>
        ${UNSUBSCRIBE_FOOTER}
      </div>
    `,
  }),
  reset_password: (d) => ({
    subject: "Réinitialisation de votre mot de passe — VicktyKof",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0A0A0A;color:#F5EDD6;padding:40px;border-radius:12px;border:1px solid #C9A84C33;">
        <h1 style="color:#C9A84C;font-size:24px;margin-bottom:8px;">VicktyKof</h1>
        <h2 style="font-size:20px;">Réinitialisation de mot de passe</h2>
        <p>Bonjour,</p>
        <p>Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte.</p>
        <div style="text-align:center;margin:32px 0;">
          <a href="${d.resetUrl}" style="display:inline-block;background:#C9A84C;color:#0A0A0A;padding:14px 28px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:16px;">
            Réinitialiser mon mot de passe
          </a>
        </div>
        <p style="color:#6B6B6B;font-size:13px;line-height:1.5;">
          Ce lien expire dans <strong>1 heure</strong>. Si vous n'avez pas fait cette demande, vous pouvez ignorer cet email en toute sécurité.
        </p>
        <hr style="border-color:#333;margin:32px 0;">
        <p style="font-size:12px;color:#6B6B6B;">Ceci est un message automatique, veuillez ne pas y répondre.</p>
      </div>
    `,
  }),
  google_signin_reminder: (d) => ({
    subject: "Connexion via Google — VicktyKof",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0A0A0A;color:#F5EDD6;padding:40px;border-radius:12px;border:1px solid #C9A84C33;">
        <h1 style="color:#C9A84C;font-size:24px;margin-bottom:8px;">VicktyKof</h1>
        <h2 style="font-size:20px;">Connexion directe Google</h2>
        <p>Bonjour,</p>
        <p>Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte.</p>
        <div style="background:#1A1A1A;padding:24px;border-radius:8px;margin:24px 0;text-align:center;">
          <p style="margin:0 0 16px 0;">Il semble que vous vous connectez habituellement à VicktyKof via <strong>Google</strong>.</p>
          <a href="${APP_URL}/login" style="display:inline-block;background:#C9A84C;color:#0A0A0A;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">
            Se connecter avec Google
          </a>
        </div>
        <p style="color:#6B6B6B;font-size:13px;line-height:1.5;">
          Comme vous utilisez la connexion Google, vous n'avez pas de mot de passe spécifique à notre site. Votre compte reste sécurisé par Google.
        </p>
        <hr style="border-color:#333;margin:32px 0;">
        <p style="font-size:12px;color:#6B6B6B;">Ceci est un message automatique de protection de compte.</p>
      </div>
    `,
  }),
};

// Retry avec backoff exponentiel — évite les emails silencieusement perdus
async function sendWithRetry(
  fn: () => Promise<void>,
  retries = 3
): Promise<void> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      await fn();
      return;
    } catch (err) {
      if (attempt === retries - 1) throw err;
      await new Promise((r) => setTimeout(r, 300 * Math.pow(2, attempt)));
    }
  }
}

export async function sendEmail({ to, template, data }: SendEmailOptions) {
  const { subject, html } = templates[template](data);

  try {
    await sendWithRetry(() =>
      transporter.sendMail({ from: process.env.EMAIL_FROM, to, subject, html }).then(() => undefined)
    );

    await prisma.emailLog.create({
      data: { to, subject, template, metadata: data as Record<string, string | number> },
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    await prisma.emailLog.create({
      data: { to, subject, template, metadata: data as Record<string, string | number>, error: errMsg },
    });
    throw error;
  }
}

export async function sendRawEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  try {
    await sendWithRetry(() =>
      transporter.sendMail({ from: process.env.EMAIL_FROM, to, subject, html }).then(() => undefined)
    );
    await prisma.emailLog.create({
      data: { to, subject, template: "raw", metadata: { html: "raw_content" } },
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    await prisma.emailLog.create({
      data: { to, subject, template: "raw", metadata: { html: "raw_content" }, error: errMsg },
    });
    throw error;
  }
}
