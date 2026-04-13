import type { Metadata } from "next";

export const metadata: Metadata = { title: "Conditions d'utilisation" };

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-brand-black">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-bold text-brand-beige mb-2">
          Conditions d&apos;utilisation
        </h1>
        <p className="text-brand-muted mb-8">Dernière mise à jour : avril 2026</p>

        <div className="space-y-8 text-brand-muted leading-relaxed">
          {[
            {
              title: "1. Acceptation des conditions",
              content: "En utilisant le site VicktyKof, vous acceptez ces conditions d'utilisation. Si vous n'êtes pas d'accord, veuillez ne pas utiliser notre service.",
            },
            {
              title: "2. Compte utilisateur",
              content: "Vous êtes responsable de la confidentialité de votre mot de passe et de toute activité sur votre compte. VicktyKof se réserve le droit de suspendre tout compte en cas d'abus.",
            },
            {
              title: "3. Réservations",
              content: "Les réservations sont confirmées uniquement après réception du dépôt. VicktyKof se réserve le droit de refuser ou d'annuler une réservation avec remboursement intégral du dépôt.",
            },
            {
              title: "4. Achats en ligne",
              content: "Les prix sont en CAD et incluent les taxes applicables. VicktyKof se réserve le droit de modifier les prix. Les commandes sont traitées sous 1-3 jours ouvrables.",
            },
            {
              title: "5. Propriété intellectuelle",
              content: "Tout le contenu du site (photos, textes, logo) est la propriété exclusive de VicktyKof. Toute reproduction sans autorisation est interdite.",
            },
            {
              title: "6. Limitation de responsabilité",
              content: "VicktyKof ne saurait être tenu responsable de dommages indirects résultant de l'utilisation du site ou de ses services.",
            },
            {
              title: "7. Droit applicable",
              content: "Ces conditions sont régies par les lois de la province de Québec, Canada.",
            },
          ].map((section) => (
            <section key={section.title}>
              <h2 className="font-display text-xl font-semibold text-brand-gold mb-3">{section.title}</h2>
              <p>{section.content}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
