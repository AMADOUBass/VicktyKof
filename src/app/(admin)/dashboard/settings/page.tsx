"use client";

import { useState } from "react";
import { Save, Clock, DollarSign, Bell, Globe, Shield } from "lucide-react";
import toast from "react-hot-toast";

interface SettingsSection {
  id: string;
  label: string;
  icon: React.ElementType;
}

const sections: SettingsSection[] = [
  { id: "general", label: "Général", icon: Globe },
  { id: "hours", label: "Horaires", icon: Clock },
  { id: "booking", label: "Réservation", icon: DollarSign },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Sécurité", icon: Shield },
];

const DEFAULT_HOURS = [
  { day: "Lundi", open: "09:00", close: "19:00", active: true },
  { day: "Mardi", open: "09:00", close: "19:00", active: true },
  { day: "Mercredi", open: "09:00", close: "19:00", active: true },
  { day: "Jeudi", open: "09:00", close: "19:00", active: true },
  { day: "Vendredi", open: "09:00", close: "19:00", active: true },
  { day: "Samedi", open: "09:00", close: "17:00", active: true },
  { day: "Dimanche", open: "09:00", close: "17:00", active: false },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("general");
  const [saving, setSaving] = useState(false);

  // General settings
  const [salonName, setSalonName] = useState("VicktyKof");
  const [salonEmail, setSalonEmail] = useState("victykoff@gmail.com");
  const [salonPhone, setSalonPhone] = useState("(581) 745-7409");
  const [salonAddress, setSalonAddress] = useState("2177 rue du Carrousel, Québec, QC G2B 5B5");

  // Hours
  const [hours, setHours] = useState(DEFAULT_HOURS);

  // Booking settings
  const [depositPct, setDepositPct] = useState(30);
  const [minBookingHours, setMinBookingHours] = useState(24);
  const [maxBookingDays, setMaxBookingDays] = useState(60);
  const [autoAccept, setAutoAccept] = useState(false);

  // Notifications
  const [emailOnBooking, setEmailOnBooking] = useState(true);
  const [emailOnCancel, setEmailOnCancel] = useState(true);
  const [emailReminder, setEmailReminder] = useState(true);
  const [reminderHours, setReminderHours] = useState(24);
  const [testLoading, setTestLoading] = useState(false);

  const handleTestEmail = async () => {
    setTestLoading(true);
    try {
      const res = await fetch("/api/admin/test-email", { method: "POST" });
      if (!res.ok) throw new Error("Erreur SMTP");
      toast.success("Email de test envoyé à bassoumamadou00@gmail.com");
    } catch (err) {
      toast.error("Erreur d'envoi. Vérifiez vos paramètres SMTP dans le fichier .env");
    } finally {
      setTestLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulated save — in production this would POST to an API
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Paramètres sauvegardés");
    setSaving(false);
  };

  const updateHour = (index: number, field: "open" | "close" | "active", value: string | boolean) => {
    setHours((prev) => prev.map((h, i) => (i === index ? { ...h, [field]: value } : h)));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-brand-beige">Paramètres</h1>
          <p className="text-brand-muted mt-1">Configurez votre salon et vos préférences.</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary gap-2">
          {saving ? (
            <span className="w-4 h-4 border-2 border-brand-black/30 border-t-brand-black rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? "Sauvegarde..." : "Sauvegarder"}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Section tabs */}
        <div className="lg:w-56 flex-shrink-0">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    activeSection === section.id
                      ? "bg-brand-gold/10 text-brand-gold border border-brand-gold/20"
                      : "text-brand-muted hover:text-brand-beige hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {section.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* ── General ──────────────────────────────────────── */}
          {activeSection === "general" && (
            <div className="card space-y-6">
              <h2 className="font-display text-xl font-semibold text-brand-beige">Informations du salon</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Nom du salon</label>
                  <input className="input" value={salonName} onChange={(e) => setSalonName(e.target.value)} />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input className="input" type="email" value={salonEmail} onChange={(e) => setSalonEmail(e.target.value)} />
                </div>
                <div>
                  <label className="label">Téléphone</label>
                  <input className="input" value={salonPhone} onChange={(e) => setSalonPhone(e.target.value)} />
                </div>
                <div>
                  <label className="label">Adresse</label>
                  <input className="input" value={salonAddress} onChange={(e) => setSalonAddress(e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* ── Hours ──────────────────────────────────────── */}
          {activeSection === "hours" && (
            <div className="card space-y-6">
              <h2 className="font-display text-xl font-semibold text-brand-beige">Horaires d&apos;ouverture</h2>
              <div className="space-y-3">
                {hours.map((h, i) => (
                  <div key={h.day} className="flex items-center gap-4 p-3 rounded-lg bg-brand-black/40 border border-white/5">
                    <label className="flex items-center gap-3 w-32">
                      <input
                        type="checkbox"
                        checked={h.active}
                        onChange={(e) => updateHour(i, "active", e.target.checked)}
                        className="w-4 h-4 accent-brand-gold rounded"
                      />
                      <span className={`text-sm font-medium ${h.active ? "text-brand-beige" : "text-brand-muted line-through"}`}>
                        {h.day}
                      </span>
                    </label>
                    {h.active ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="time"
                          value={h.open}
                          onChange={(e) => updateHour(i, "open", e.target.value)}
                          className="input py-1.5 px-3 w-32 text-sm"
                        />
                        <span className="text-brand-muted text-sm">à</span>
                        <input
                          type="time"
                          value={h.close}
                          onChange={(e) => updateHour(i, "close", e.target.value)}
                          className="input py-1.5 px-3 w-32 text-sm"
                        />
                      </div>
                    ) : (
                      <span className="text-sm text-red-400">Fermé</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Booking ─────────────────────────────────────── */}
          {activeSection === "booking" && (
            <div className="card space-y-6">
              <h2 className="font-display text-xl font-semibold text-brand-beige">Paramètres de réservation</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="label">Pourcentage de dépôt (%)</label>
                  <input
                    type="number"
                    className="input"
                    min={10}
                    max={100}
                    value={depositPct}
                    onChange={(e) => setDepositPct(Number(e.target.value))}
                  />
                  <p className="text-xs text-brand-muted mt-1.5">
                    Le pourcentage du prix total requis comme dépôt lors de la réservation.
                  </p>
                </div>
                <div>
                  <label className="label">Délai minimum de réservation (heures)</label>
                  <input
                    type="number"
                    className="input"
                    min={1}
                    value={minBookingHours}
                    onChange={(e) => setMinBookingHours(Number(e.target.value))}
                  />
                  <p className="text-xs text-brand-muted mt-1.5">
                    Nombre d&apos;heures minimum avant un rendez-vous.
                  </p>
                </div>
                <div>
                  <label className="label">Réservation max. (jours à l&apos;avance)</label>
                  <input
                    type="number"
                    className="input"
                    min={7}
                    max={365}
                    value={maxBookingDays}
                    onChange={(e) => setMaxBookingDays(Number(e.target.value))}
                  />
                  <p className="text-xs text-brand-muted mt-1.5">
                    Combien de jours à l&apos;avance les clientes peuvent réserver.
                  </p>
                </div>
                <div>
                  <label className="label">Acceptation automatique</label>
                  <div className="mt-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div
                        onClick={() => setAutoAccept(!autoAccept)}
                        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                          autoAccept ? "bg-brand-gold" : "bg-brand-charcoal border border-white/10"
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 w-5 h-5 rounded-full transition-all duration-200 ${
                            autoAccept
                              ? "left-[22px] bg-brand-black"
                              : "left-0.5 bg-brand-muted"
                          }`}
                        />
                      </div>
                      <span className="text-sm text-brand-muted">
                        {autoAccept ? "Activé" : "Désactivé"}
                      </span>
                    </label>
                  </div>
                  <p className="text-xs text-brand-muted mt-1.5">
                    Confirmer automatiquement les rendez-vous après le paiement du dépôt.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── Notifications ───────────────────────────────── */}
          {activeSection === "notifications" && (
            <div className="card space-y-6">
              <h2 className="font-display text-xl font-semibold text-brand-beige">Notifications par email</h2>
              <div className="space-y-5">
                {[
                  {
                    label: "Nouvelle réservation",
                    desc: "Recevoir un email quand une cliente réserve un rendez-vous.",
                    checked: emailOnBooking,
                    set: setEmailOnBooking,
                  },
                  {
                    label: "Annulation",
                    desc: "Recevoir un email quand une réservation est annulée.",
                    checked: emailOnCancel,
                    set: setEmailOnCancel,
                  },
                  {
                    label: "Rappel automatique",
                    desc: "Envoyer un rappel par email aux clientes avant leur rendez-vous.",
                    checked: emailReminder,
                    set: setEmailReminder,
                  },
                ].map((notif) => (
                  <div key={notif.label} className="flex items-start justify-between gap-4 p-4 rounded-lg bg-brand-black/40 border border-white/5">
                    <div>
                      <p className="text-sm font-medium text-brand-beige">{notif.label}</p>
                      <p className="text-xs text-brand-muted mt-0.5">{notif.desc}</p>
                    </div>
                    <div
                      onClick={() => notif.set(!notif.checked)}
                      className={`relative w-11 h-6 rounded-full flex-shrink-0 cursor-pointer transition-colors duration-200 ${
                        notif.checked ? "bg-brand-gold" : "bg-brand-charcoal border border-white/10"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 w-5 h-5 rounded-full transition-all duration-200 ${
                          notif.checked
                            ? "left-[22px] bg-brand-black"
                            : "left-0.5 bg-brand-muted"
                        }`}
                      />
                    </div>
                  </div>
                ))}

                {emailReminder && (
                  <div className="pl-4 border-l-2 border-brand-gold/20 ml-2">
                    <label className="label">Envoyer le rappel combien d&apos;heures avant ?</label>
                    <input
                      type="number"
                      className="input w-32"
                      min={1}
                      max={72}
                      value={reminderHours}
                      onChange={(e) => setReminderHours(Number(e.target.value))}
                    />
                  </div>
                )}

                <div className="pt-6 border-t border-white/5">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-brand-gold/5 border border-brand-gold/20">
                    <div>
                      <p className="text-sm font-semibold text-brand-gold">Vérifier la configuration SMTP</p>
                      <p className="text-xs text-brand-muted mt-1">
                        Envoyer un email de test à <strong>bassoumamadou00@gmail.com</strong> pour valider vos paramètres.
                      </p>
                    </div>
                    <button
                      onClick={handleTestEmail}
                      disabled={testLoading}
                      className="btn-primary py-2 px-4 text-xs gap-2"
                    >
                      {testLoading ? (
                        <span className="w-3 h-3 border-2 border-brand-black/30 border-t-brand-black rounded-full animate-spin" />
                      ) : (
                        <Bell className="w-3 h-3" />
                      )}
                      Tester maintenant
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Security ────────────────────────────────────── */}
          {activeSection === "security" && (
            <div className="card space-y-6">
              <h2 className="font-display text-xl font-semibold text-brand-beige">Sécurité</h2>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-brand-black/40 border border-white/5">
                  <p className="text-sm font-medium text-brand-beige mb-1">Changer le mot de passe admin</p>
                  <p className="text-xs text-brand-muted mb-4">
                    Le mot de passe doit contenir au moins 8 caractères.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Nouveau mot de passe</label>
                      <input type="password" className="input" placeholder="••••••••" />
                    </div>
                    <div>
                      <label className="label">Confirmer</label>
                      <input type="password" className="input" placeholder="••••••••" />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-brand-black/40 border border-white/5">
                  <p className="text-sm font-medium text-brand-beige mb-1">Clés API</p>
                  <p className="text-xs text-brand-muted mb-3">
                    Gérer vos clés Stripe et UploadThing. Ces valeurs sont stockées dans les variables d&apos;environnement.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-brand-charcoal rounded-lg px-4 py-3">
                      <div>
                        <p className="text-sm text-brand-beige">Stripe</p>
                        <p className="text-xs text-brand-muted font-mono">sk_live_••••••••</p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                        Connecté
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-brand-charcoal rounded-lg px-4 py-3">
                      <div>
                        <p className="text-sm text-brand-beige">UploadThing</p>
                        <p className="text-xs text-brand-muted font-mono">ut_••••••••</p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                        Connecté
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
