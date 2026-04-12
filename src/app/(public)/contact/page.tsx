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
                    <a href="mailto:victykoff@gmail.com" className="text-brand-muted text-sm mt-1 hover:text-brand-gold transition-colors block">
                      victykoff@gmail.com
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

        {/* Google Map */}
        <div className="mt-10 rounded-2xl overflow-hidden border border-brand-charcoal h-72 shadow-lg">
          <iframe
            title="VicktyKof — Carte"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2732.1234567890!2d-71.3456!3d46.8523!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cb896a4a45e7d3f%3A0x1234567890abcdef!2s2177+Rue+du+Carrousel%2C+Qu%C3%A9bec%2C+QC+G2B+5B5!5e0!3m2!1sfr!2sca!4v1234567890"
            width="100%"
            height="100%"
            style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}
