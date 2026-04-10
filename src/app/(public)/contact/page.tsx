import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez VicktyKof — Salon de coiffure à Québec. 2177 rue du Carrousel, G2B 5B5.",
};

const hours = [
  { day: "Lundi – Vendredi", time: "9h00 – 19h00" },
  { day: "Samedi", time: "9h00 – 17h00" },
  { day: "Dimanche", time: "Fermé" },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-brand-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-brand-gold text-sm font-medium uppercase tracking-widest mb-3">Contact</p>
          <h1 className="section-title">Nous joindre</h1>
          <div className="divider-gold" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Info */}
          <div className="space-y-8">
            <div className="card">
              <h2 className="font-display text-xl font-semibold text-brand-gold mb-6">Informations</h2>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-brand-gold/10 border border-brand-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-brand-gold" />
                  </div>
                  <div>
                    <p className="font-medium text-brand-beige">Adresse</p>
                    <p className="text-brand-muted text-sm mt-1">
                      2177 rue du Carrousel<br />Québec, QC G2B 5B5
                    </p>
                    <a
                      href="https://maps.google.com/?q=2177+rue+du+Carrousel+Quebec"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-brand-gold hover:underline mt-1 inline-block"
                    >
                      Voir sur Google Maps →
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-brand-gold/10 border border-brand-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-brand-gold" />
                  </div>
                  <div>
                    <p className="font-medium text-brand-beige">Téléphone</p>
                    <a href="tel:+15817457409" className="text-brand-muted text-sm mt-1 hover:text-brand-gold transition-colors block">
                      (581) 745-7409
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-brand-gold/10 border border-brand-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-brand-gold" />
                  </div>
                  <div>
                    <p className="font-medium text-brand-beige">Email</p>
                    <a href="mailto:vicktykoff@gmail.com" className="text-brand-muted text-sm mt-1 hover:text-brand-gold transition-colors block">
                      vicktykoff@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="font-display text-xl font-semibold text-brand-gold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" /> Horaires
              </h2>
              <div className="space-y-3">
                {hours.map((h) => (
                  <div key={h.day} className="flex justify-between text-sm">
                    <span className="text-brand-muted">{h.day}</span>
                    <span className={h.time === "Fermé" ? "text-red-400" : "text-brand-beige font-medium"}>
                      {h.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="card">
            <h2 className="font-display text-xl font-semibold text-brand-beige mb-6">Envoyer un message</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
