"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Plus, Pencil, X, Star, Calendar } from "lucide-react";
import toast from "react-hot-toast";

import { UserAvatar } from "@/components/ui/UserAvatar";

type Specialty = "RETWIST" | "INTERLOCKS" | "WOMENS_STYLING" | "STARTER_LOCS" | "LOC_MAINTENANCE" | "BRAIDING" | "NATURAL_STYLES";

const SPECIALTY_LABELS: Record<Specialty, string> = {
  RETWIST: "Retwist",
  INTERLOCKS: "Interlocks",
  WOMENS_STYLING: "Coiffure femme",
  STARTER_LOCS: "Locs débutants",
  LOC_MAINTENANCE: "Entretien locs",
  BRAIDING: "Tresses",
  NATURAL_STYLES: "Styles naturels",
};

const ALL_SPECIALTIES = Object.keys(SPECIALTY_LABELS) as Specialty[];

const DAY_LABELS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

interface Availability { dayOfWeek: number; startTime: string; endTime: string; isActive: boolean }

interface Stylist {
  id: string;
  yearsExp: number;
  bio: string | null;
  isActive: boolean;
  avatarUrl: string | null;
  specialties: Specialty[];
  user: { name: string | null; email: string | null; image: string | null };
  availability: Availability[];
  _count?: { appointments: number };
}

interface FormData {
  bio: string;
  yearsExp: string;
  specialties: Specialty[];
  availability: { dayOfWeek: number; startTime: string; endTime: string; enabled: boolean }[];
}

const DEFAULT_AVAIL = DAY_LABELS.map((_, i) => ({
  dayOfWeek: i,
  startTime: "09:00",
  endTime: "18:00",
  enabled: i >= 1 && i <= 5, // Mon–Fri
}));

export default function AdminStylistsPage() {
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [loading, setLoading] = useState(true);
  const [editStylist, setEditStylist] = useState<Stylist | null>(null);
  const [form, setForm] = useState<FormData>({ bio: "", yearsExp: "0", specialties: [], availability: DEFAULT_AVAIL });
  const [saving, setSaving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [addForm, setAddForm] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    bio: "", 
    yearsExp: "0", 
    specialties: [] as Specialty[],
    availability: DEFAULT_AVAIL
  });

  const fetch_ = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stylists");
      const data = await res.json() as Stylist[];
      setStylists(data);
    } catch {
      toast.error("Impossible de charger les stylistes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetch_(); }, [fetch_]);

  function openEdit(stylist: Stylist) {
    setEditStylist(stylist);
    setForm({
      bio: stylist.bio ?? "",
      yearsExp: stylist.yearsExp.toString(),
      specialties: stylist.specialties,
      availability: DEFAULT_AVAIL.map((d) => {
        const existing = stylist.availability.find((a) => a.dayOfWeek === d.dayOfWeek);
        return existing
          ? { dayOfWeek: d.dayOfWeek, startTime: existing.startTime, endTime: existing.endTime, enabled: existing.isActive }
          : { ...d };
      }),
    });
  }

  async function handleSave() {
    if (!editStylist) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/stylists/${editStylist.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bio: form.bio || undefined,
          yearsExp: parseInt(form.yearsExp, 10),
          specialties: form.specialties,
          availability: form.availability
            .filter((a) => a.enabled)
            .map(({ dayOfWeek, startTime, endTime }) => ({ dayOfWeek, startTime, endTime })),
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Profil mis à jour");
      setEditStylist(null);
      void fetch_();
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  }

  async function handleCreate() {
    if (!addForm.name || !addForm.email || !addForm.password) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/stylists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: addForm.name,
          email: addForm.email,
          password: addForm.password,
          bio: addForm.bio || undefined,
          yearsExp: parseInt(addForm.yearsExp, 10),
          specialties: addForm.specialties,
        }),
      });
      if (!res.ok) {
        const err = await res.json() as { error?: string };
        throw new Error(err.error || "Erreur lors de la création");
      }
      toast.success("Styliste créé avec succès");
      setIsAdding(false);
      setAddForm({ name: "", email: "", password: "", bio: "", yearsExp: "0", specialties: [], availability: DEFAULT_AVAIL });
      void fetch_();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSaving(false);
    }
  }

  function toggleSpecialty(s: Specialty) {
    setForm((f) => ({
      ...f,
      specialties: f.specialties.includes(s) ? f.specialties.filter((x) => x !== s) : [...f.specialties, s],
    }));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-brand-beige">Stylistes</h1>
          <p className="text-brand-muted mt-1">{stylists.length} membres de l'équipe</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="btn-primary w-fit flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Ajouter un styliste
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="card h-48 animate-pulse" />)}
        </div>
      ) : stylists.length === 0 ? (
        <div className="card text-center py-12">
          <Users className="w-10 h-10 text-brand-muted mx-auto mb-3" />
          <p className="text-brand-muted">Aucun styliste trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {stylists.map((stylist) => (
            <motion.div key={stylist.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card space-y-4">
              <div className="flex items-start gap-3">
                <UserAvatar 
                  src={stylist.user.image ?? stylist.avatarUrl} 
                  name={stylist.user.name} 
                  size="md" 
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-brand-beige">{stylist.user.name ?? "—"}</p>
                  <p className="text-xs text-brand-muted">{stylist.user.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-brand-gold flex items-center gap-1">
                      <Star className="w-3 h-3" />{stylist.yearsExp} ans exp.
                    </span>
                    <span className={`w-2 h-2 rounded-full ${stylist.isActive ? "bg-green-400" : "bg-red-400"}`} />
                    <span className="text-xs text-brand-muted">{stylist.isActive ? "Actif" : "Inactif"}</span>
                  </div>
                </div>
                <button
                  onClick={() => openEdit(stylist)}
                  className="p-1.5 rounded-lg bg-brand-gold/10 text-brand-gold hover:bg-brand-gold/20 transition-colors shrink-0"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>

              {stylist.bio && <p className="text-xs text-brand-muted line-clamp-2">{stylist.bio}</p>}

              {stylist.specialties.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {stylist.specialties.map((s) => (
                    <span key={s} className="text-xs bg-brand-gold/10 text-brand-gold border border-brand-gold/20 px-2 py-0.5 rounded-full">
                      {SPECIALTY_LABELS[s]}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex gap-1">
                {DAY_LABELS.map((label, i) => {
                  const avail = stylist.availability.find((a) => a.dayOfWeek === i);
                  return (
                    <div
                      key={i}
                      title={avail ? `${avail.startTime}–${avail.endTime}` : "Indisponible"}
                      className={`flex-1 text-center py-1 rounded text-xs font-medium ${
                        avail?.isActive ? "bg-brand-gold/20 text-brand-gold" : "bg-brand-charcoal text-brand-muted"
                      }`}
                    >
                      {label[0]}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add modal */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-black/80 flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && setIsAdding(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-brand-charcoal rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-bold text-brand-beige">
                  Ajouter un nouveau styliste
                </h2>
                <button onClick={() => setIsAdding(false)} className="text-brand-muted hover:text-brand-beige transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Nom complet *</label>
                  <input
                    className="input"
                    value={addForm.name}
                    onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Ex: Vicky Kof"
                  />
                </div>
                <div>
                  <label className="label">Email *</label>
                  <input
                    className="input"
                    type="email"
                    value={addForm.email}
                    onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="vicky@vicktykof.com"
                  />
                </div>
              </div>

              <div>
                <label className="label">Mot de passe initial *</label>
                <input
                  className="input"
                  type="password"
                  value={addForm.password}
                  onChange={(e) => setAddForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="Min. 8 caractères"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Années d'expérience</label>
                  <input
                    type="number"
                    min="0"
                    className="input"
                    value={addForm.yearsExp}
                    onChange={(e) => setAddForm((f) => ({ ...f, yearsExp: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="label">Spécialités</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {ALL_SPECIALTIES.map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setAddForm(f => ({
                            ...f,
                            specialties: f.specialties.includes(s) 
                              ? f.specialties.filter(x => x !== s) 
                              : [...f.specialties, s]
                          }))
                        }}
                        className={`text-[10px] px-2 py-1 rounded-full border transition-colors ${
                          addForm.specialties.includes(s)
                            ? "bg-brand-gold text-brand-black border-brand-gold"
                            : "border-brand-muted text-brand-muted"
                        }`}
                      >
                        {SPECIALTY_LABELS[s]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="label">Biographie</label>
                <textarea
                  className="input w-full h-20 resize-none text-sm"
                  value={addForm.bio}
                  onChange={(e) => setAddForm((f) => ({ ...f, bio: e.target.value }))}
                  placeholder="Expertise, style préféré..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={() => setIsAdding(false)} className="btn-outline flex-1">Annuler</button>
                <button onClick={handleCreate} disabled={saving} className="btn-primary flex-1 disabled:opacity-60">
                  {saving ? "Création..." : "Créer le compte"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit modal */}
      <AnimatePresence>
        {editStylist && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-black/80 flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && setEditStylist(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-brand-charcoal rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto space-y-5"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-bold text-brand-beige">
                  Modifier — {editStylist.user.name}
                </h2>
                <button onClick={() => setEditStylist(null)} className="text-brand-muted hover:text-brand-beige transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="label">Biographie</label>
                <textarea
                  className="input w-full h-24 resize-none"
                  value={form.bio}
                  onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                  placeholder="Décrivez l'expérience et la spécialité de ce styliste..."
                />
              </div>

              <div>
                <label className="label">Années d'expérience</label>
                <input
                  type="number"
                  min="0"
                  className="input w-32"
                  value={form.yearsExp}
                  onChange={(e) => setForm((f) => ({ ...f, yearsExp: e.target.value }))}
                />
              </div>

              <div>
                <label className="label mb-2">Spécialités</label>
                <div className="flex flex-wrap gap-2">
                  {ALL_SPECIALTIES.map((s) => (
                    <button
                      key={s}
                      onClick={() => toggleSpecialty(s)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                        form.specialties.includes(s)
                          ? "bg-brand-gold text-brand-black border-brand-gold"
                          : "border-brand-muted text-brand-muted hover:border-brand-gold hover:text-brand-gold"
                      }`}
                    >
                      {SPECIALTY_LABELS[s]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label mb-2">Disponibilités</label>
                <div className="space-y-2">
                  {form.availability.map((d, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <label className="flex items-center gap-2 w-24 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={d.enabled}
                          onChange={(e) => setForm((f) => ({
                            ...f,
                            availability: f.availability.map((a, j) => j === i ? { ...a, enabled: e.target.checked } : a),
                          }))}
                          className="accent-brand-gold"
                        />
                        <span className={`text-sm ${d.enabled ? "text-brand-beige" : "text-brand-muted"}`}>
                          {DAY_LABELS[d.dayOfWeek]}
                        </span>
                      </label>
                      {d.enabled && (
                        <>
                          <input
                            type="time"
                            className="input text-sm py-1 px-2 w-28"
                            value={d.startTime}
                            onChange={(e) => setForm((f) => ({
                              ...f,
                              availability: f.availability.map((a, j) => j === i ? { ...a, startTime: e.target.value } : a),
                            }))}
                          />
                          <span className="text-brand-muted text-sm">à</span>
                          <input
                            type="time"
                            className="input text-sm py-1 px-2 w-28"
                            value={d.endTime}
                            onChange={(e) => setForm((f) => ({
                              ...f,
                              availability: f.availability.map((a, j) => j === i ? { ...a, endTime: e.target.value } : a),
                            }))}
                          />
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setEditStylist(null)} className="btn-outline flex-1">Annuler</button>
                <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 disabled:opacity-60">
                  {saving ? "Sauvegarde..." : "Enregistrer"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
