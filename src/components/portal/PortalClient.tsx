"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, CheckCircle2, TrendingUp, ImageIcon, Clock,
  User, Phone, Mail, Plus, X, Trash2, Star,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

type Specialty = "RETWIST" | "INTERLOCKS" | "WOMENS_STYLING" | "STARTER_LOCS" | "LOC_MAINTENANCE" | "BRAIDING" | "NATURAL_STYLES";

const SPECIALTY_LABELS: Record<Specialty, string> = {
  RETWIST: "Retwist", INTERLOCKS: "Interlocks", WOMENS_STYLING: "Coiffure femme",
  STARTER_LOCS: "Locs débutants", LOC_MAINTENANCE: "Entretien locs", BRAIDING: "Tresses", NATURAL_STYLES: "Styles naturels",
};

const DAY_LABELS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

interface Appointment {
  id: string; status: string; scheduledAt: string; durationMins: number; totalPrice: number; notes: string | null;
  client: { name: string | null; email: string | null; phone: string | null; image: string | null };
  service: { name: string; durationMins: number };
}

interface PortfolioPhoto { id: string; url: string; caption: string | null; tags: string[]; createdAt: string }

interface Props {
  stylist: {
    id: string; bio: string | null; yearsExp: number; specialties: Specialty[];
    user: { name: string | null; image: string | null; email: string | null };
    availability: { dayOfWeek: number; startTime: string; endTime: string; isActive: boolean }[];
    portfolio: PortfolioPhoto[];
  };
  appointments: Appointment[];
  stats: { completedTotal: number; completedThisMonth: number; upcomingCount: number; portfolioCount: number };
}

function getInitials(name: string | null) {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export function PortalClient({ stylist, appointments, stats }: Props) {
  const [tab, setTab] = useState<"agenda" | "portfolio">("agenda");
  const [portfolio, setPortfolio] = useState(stylist.portfolio);
  const [showAddPhoto, setShowAddPhoto] = useState(false);
  const [photoForm, setPhotoForm] = useState({ url: "", caption: "", tags: "" });
  const [saving, setSaving] = useState(false);
  const [expandedAppt, setExpandedAppt] = useState<string | null>(null);

  async function addPortfolioPhoto() {
    if (!photoForm.url) { toast.error("URL requise"); return; }
    setSaving(true);
    try {
      const res = await fetch(`/api/stylists/${stylist.id}/portfolio`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: photoForm.url,
          caption: photoForm.caption || undefined,
          tags: photoForm.tags.split(",").map((t) => t.trim()).filter(Boolean),
        }),
      });
      if (!res.ok) throw new Error();
      const photo = await res.json() as PortfolioPhoto;
      setPortfolio((prev) => [{ ...photo, createdAt: typeof photo.createdAt === "string" ? photo.createdAt : new Date().toISOString() }, ...prev]);
      setPhotoForm({ url: "", caption: "", tags: "" });
      setShowAddPhoto(false);
      toast.success("Photo ajoutée au portfolio");
    } catch {
      toast.error("Impossible d'ajouter la photo");
    } finally {
      setSaving(false);
    }
  }

  async function deletePortfolioPhoto(id: string) {
    if (!confirm("Supprimer cette photo ?")) return;
    try {
      await fetch(`/api/stylists/${stylist.id}/portfolio/${id}`, { method: "DELETE" });
      setPortfolio((prev) => prev.filter((p) => p.id !== id));
      toast.success("Photo supprimée");
    } catch {
      toast.error("Erreur");
    }
  }

  const statCards = [
    { label: "RDV ce mois", value: stats.completedThisMonth, icon: TrendingUp, color: "text-brand-gold" },
    { label: "RDV à venir", value: stats.upcomingCount, icon: Calendar, color: "text-blue-400" },
    { label: "Services rendus", value: stats.completedTotal, icon: CheckCircle2, color: "text-green-400" },
    { label: "Photos portfolio", value: stats.portfolioCount, icon: ImageIcon, color: "text-purple-400" },
  ];

  return (
    <div className="space-y-8 pt-6">
      {/* Profile header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-xl bg-brand-gold/20 flex items-center justify-center text-brand-gold font-bold text-xl overflow-hidden shrink-0">
          {stylist.user.image
            ? <Image src={stylist.user.image} alt="" width={64} height={64} className="object-cover w-full h-full" />
            : getInitials(stylist.user.name)}
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-beige">{stylist.user.name ?? "Mon portail"}</h1>
          <p className="text-brand-muted text-sm">{stylist.user.email}</p>
          {stylist.specialties.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {stylist.specialties.map((s) => (
                <span key={s} className="text-xs bg-brand-gold/10 text-brand-gold px-2 py-0.5 rounded-full">
                  {SPECIALTY_LABELS[s]}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card text-center">
            <Icon className={`w-6 h-6 ${color} mx-auto mb-2`} />
            <p className={`font-display text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-brand-muted mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Availability summary */}
      <div className="card">
        <h2 className="font-semibold text-brand-beige mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-brand-gold" />
          Mes disponibilités
        </h2>
        <div className="flex gap-2 flex-wrap">
          {DAY_LABELS.map((label, i) => {
            const avail = stylist.availability.find((a) => a.dayOfWeek === i);
            return (
              <div key={i} className={`px-3 py-2 rounded-xl text-xs font-medium ${avail?.isActive ? "bg-brand-gold/10 text-brand-gold border border-brand-gold/20" : "bg-brand-charcoal text-brand-muted"}`}>
                <p className="font-semibold">{label}</p>
                {avail?.isActive && <p className="text-brand-gold/70">{avail.startTime}–{avail.endTime}</p>}
                {!avail?.isActive && <p>Fermé</p>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-brand-charcoal rounded-xl p-1 w-fit">
        {(["agenda", "portfolio"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t ? "bg-brand-gold text-brand-black" : "text-brand-muted hover:text-brand-beige"
            }`}
          >
            {t === "agenda" ? <><Calendar className="w-4 h-4" />Agenda ({appointments.length})</> : <><ImageIcon className="w-4 h-4" />Portfolio ({portfolio.length})</>}
          </button>
        ))}
      </div>

      {/* Agenda */}
      {tab === "agenda" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          {appointments.length === 0 ? (
            <div className="card text-center py-10">
              <Calendar className="w-8 h-8 text-brand-muted mx-auto mb-2" />
              <p className="text-brand-muted">Aucun rendez-vous à venir</p>
            </div>
          ) : (
            appointments.map((appt) => {
              const date = new Date(appt.scheduledAt);
              const isExpanded = expandedAppt === appt.id;
              return (
                <div key={appt.id} className="card cursor-pointer" onClick={() => setExpandedAppt(isExpanded ? null : appt.id)}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-gold/10 rounded-xl flex flex-col items-center justify-center text-brand-gold shrink-0">
                      <span className="text-xs font-bold leading-none">{date.toLocaleDateString("fr-CA",{month:"short"}).toUpperCase()}</span>
                      <span className="font-display text-lg font-bold leading-none">{date.getDate()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-brand-beige">{appt.service.name}</p>
                      <p className="text-sm text-brand-muted">
                        {date.toLocaleTimeString("fr-CA",{hour:"2-digit",minute:"2-digit"})} · {appt.durationMins} min
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold text-brand-gold">{formatPrice(appt.totalPrice)}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${appt.status === "ACCEPTED" ? "bg-green-400/10 text-green-400" : "bg-blue-400/10 text-blue-400"}`}>
                        {appt.status === "ACCEPTED" ? "Confirmé" : "En attente"}
                      </span>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="border-t border-brand-charcoal mt-4 pt-4 space-y-2 overflow-hidden"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold text-xs font-bold shrink-0 overflow-hidden">
                            {appt.client.image
                              ? <Image src={appt.client.image} alt="" width={32} height={32} className="rounded-full" />
                              : getInitials(appt.client.name)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-brand-beige">{appt.client.name ?? "Cliente"}</p>
                            <div className="flex items-center gap-3 text-xs text-brand-muted">
                              {appt.client.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{appt.client.email}</span>}
                              {appt.client.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{appt.client.phone}</span>}
                            </div>
                          </div>
                        </div>
                        {appt.notes && (
                          <p className="text-xs text-brand-muted italic bg-brand-black/40 rounded-lg px-3 py-2">
                            Note : {appt.notes}
                          </p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </motion.div>
      )}

      {/* Portfolio */}
      {tab === "portfolio" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <button onClick={() => setShowAddPhoto(true)} className="btn-outline flex items-center gap-2 w-full justify-center py-3 border-dashed">
            <Plus className="w-4 h-4" />
            Ajouter une photo au portfolio
          </button>

          {portfolio.length === 0 ? (
            <div className="card text-center py-10">
              <ImageIcon className="w-8 h-8 text-brand-muted mx-auto mb-2" />
              <p className="text-brand-muted">Portfolio vide — ajoutez vos meilleures réalisations</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {portfolio.map((photo) => (
                <div key={photo.id} className="group relative aspect-square rounded-xl overflow-hidden bg-brand-charcoal">
                  <Image src={photo.url} alt={photo.caption ?? ""} fill className="object-cover" />
                  <div className="absolute inset-0 bg-brand-black/0 group-hover:bg-brand-black/50 transition-all flex items-end justify-between p-2 opacity-0 group-hover:opacity-100">
                    <div className="flex-1">
                      {photo.caption && <p className="text-xs text-white line-clamp-2">{photo.caption}</p>}
                    </div>
                    <button
                      onClick={() => void deletePortfolioPhoto(photo.id)}
                      className="p-1.5 rounded-lg bg-red-400/20 text-red-400 hover:bg-red-400/30 transition-colors ml-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Add photo modal */}
      <AnimatePresence>
        {showAddPhoto && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-black/80 flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && setShowAddPhoto(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-brand-charcoal rounded-2xl p-6 w-full max-w-md space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-bold text-brand-beige">Ajouter au portfolio</h2>
                <button onClick={() => setShowAddPhoto(false)} className="text-brand-muted hover:text-brand-beige"><X className="w-5 h-5" /></button>
              </div>
              <div>
                <label className="label">URL de la photo *</label>
                <input className="input w-full" placeholder="https://..." value={photoForm.url} onChange={(e) => setPhotoForm((f) => ({ ...f, url: e.target.value }))} />
              </div>
              {photoForm.url && (
                <div className="relative h-40 rounded-xl overflow-hidden bg-brand-black">
                  <Image src={photoForm.url} alt="Aperçu" fill className="object-contain" />
                </div>
              )}
              <div>
                <label className="label">Légende</label>
                <input className="input w-full" value={photoForm.caption} onChange={(e) => setPhotoForm((f) => ({ ...f, caption: e.target.value }))} />
              </div>
              <div>
                <label className="label">Tags (virgule)</label>
                <input className="input w-full" placeholder="locs, retwist..." value={photoForm.tags} onChange={(e) => setPhotoForm((f) => ({ ...f, tags: e.target.value }))} />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowAddPhoto(false)} className="btn-outline flex-1">Annuler</button>
                <button onClick={addPortfolioPhoto} disabled={saving} className="btn-primary flex-1 disabled:opacity-60">
                  {saving ? "Ajout..." : "Ajouter"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
