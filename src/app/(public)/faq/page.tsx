"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import Link from "next/link";

const FAQ_SECTIONS = [
  {
    section: "Réservations & Rendez-vous",
    items: [
      {
        q: "Comment réserver un rendez-vous ?",
        a: "Vous pouvez réserver directement en ligne via notre page Réserver. Il suffit de choisir votre service, votre styliste, puis une date et heure disponibles. Un dépôt de 30% est requis pour confirmer votre réservation.",
      },
      {
        q: "Quels modes de paiement acceptez-vous ?",
        a: "Nous acceptons les paiements en ligne par carte de crédit ou débit via Stripe (Visa, Mastercard, American Express). Le solde restant peut être payé en salon.",
      },
      {
        q: "Puis-je annuler ou reprogrammer mon rendez-vous ?",
        a: "Oui, vous pouvez annuler ou reprogrammer depuis votre espace client jusqu'à 24h avant votre rendez-vous. Passé ce délai, le dépôt pourrait ne pas être remboursé selon nos conditions.",
      },
      {
        q: "Que se passe-t-il si je suis en retard ?",
        a: "Nous accordons une grace period de 15 minutes. Au-delà, nous pourrions être dans l'obligation d'annuler le rendez-vous pour respecter les clients suivants. Veuillez nous contacter si vous êtes en chemin.",
      },
    ],
  },
  {
    section: "Nos Services",
    items: [
      {
        q: "Quels types de cheveux servez-vous ?",
        a: "Nous nous spécialisons dans les cheveux afro texturés — locs, tresses, retwist, styles naturels et plus encore. Toutes nos stylistes sont formées pour tous les types de textures afro.",
      },
      {
        q: "Combien de temps dure une séance en moyenne ?",
        a: "La durée varie selon le service : un retwist prend généralement 1h30–2h, des tresses 2h–5h selon la longueur et le style. La durée estimée est toujours affichée lors de la réservation.",
      },
      {
        q: "Faut-il venir avec les cheveux lavés ?",
        a: "Pour la plupart de services, oui nous recommandons de venir avec les cheveux propres et dénoués. Pour certains services comme le retwist ou les locs, des instructions spécifiques vous seront communiquées.",
      },
    ],
  },
  {
    section: "Boutique & Livraison",
    items: [
      {
        q: "Livrez-vous partout au Canada ?",
        a: "Oui ! Nous offrons la livraison dans toutes les provinces canadiennes. La livraison est gratuite sur les commandes de 75$ et plus. Le délai habituel est de 3–7 jours ouvrables.",
      },
      {
        q: "Puis-je retourner un produit ?",
        a: "Les produits non ouverts peuvent être retournés dans les 30 jours suivant l'achat. Les produits ouverts ou utilisés ne sont pas acceptés en retour pour des raisons d'hygiène.",
      },
      {
        q: "Qu'est-ce que le programme membres VicktyKof ?",
        a: "Les membres ont accès à des prix exclusifs sur tous nos produits, des offres spéciales et des invitations en avant-première. L'adhésion est gratuite et peut être activée depuis votre profil.",
      },
    ],
  },
  {
    section: "Compte & Confidentialité",
    items: [
      {
        q: "Comment créer un compte ?",
        a: "Cliquez sur Inscription dans la barre de navigation. Vous pouvez vous inscrire avec votre adresse courriel ou votre compte Google en un seul clic.",
      },
      {
        q: "Mes données sont-elles sécurisées ?",
        a: "Absolument. Nous utilisons le chiffrement SSL, et vos données de paiement ne sont jamais stockées chez nous — elles transitent directement via Stripe, certifié PCI DSS.",
      },
      {
        q: "Comment supprimer mon compte ?",
        a: "Vous pouvez supprimer votre compte à tout moment depuis la section Mon profil > Zone de suppression. Vos données personnelles seront anonymisées conformément à notre politique de confidentialité.",
      },
    ],
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-brand-charcoal rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-white/3 transition-colors"
      >
        <span className="font-medium text-brand-beige text-sm sm:text-base">{q}</span>
        <ChevronDown
          className={`w-5 h-5 text-brand-gold shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-sm text-brand-muted leading-relaxed border-t border-brand-charcoal pt-4">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-brand-black">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-brand-gold text-sm font-medium uppercase tracking-widest mb-3">
            Aide
          </p>
          <h1 className="section-title">Questions fréquentes</h1>
          <div className="divider-gold" />
          <p className="text-brand-muted text-sm mt-4">
            Vous ne trouvez pas la réponse ?{" "}
            <Link href="/contact" className="text-brand-gold hover:underline">
              Contactez-nous directement.
            </Link>
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {FAQ_SECTIONS.map((sec) => (
            <section key={sec.section}>
              <div className="flex items-center gap-3 mb-4">
                <HelpCircle className="w-5 h-5 text-brand-gold shrink-0" />
                <h2 className="font-display text-xl font-semibold text-brand-beige">
                  {sec.section}
                </h2>
              </div>
              <div className="space-y-2">
                {sec.items.map((item) => (
                  <FaqItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 card text-center">
          <p className="font-display text-xl font-semibold text-brand-beige mb-2">
            Encore des questions ?
          </p>
          <p className="text-brand-muted text-sm mb-5">
            Notre équipe est là pour vous aider du lundi au samedi.
          </p>
          <Link href="/contact" className="btn-primary inline-block">
            Nous contacter
          </Link>
        </div>
      </div>
    </div>
  );
}
