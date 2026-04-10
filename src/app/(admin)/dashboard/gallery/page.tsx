"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Images, Plus, Trash2, Star, X, Tag, Upload } from "lucide-react";
import toast from "react-hot-toast";

interface GalleryPhoto {
  id: string;
  url: string;
  caption: string | null;
  altText: string | null;
  tags: string[];
  isFeatured: boolean;
  createdAt: string;
}

interface AddForm {
  url: string;
  caption: string;
  altText: string;
  tags: string;
  isFeatured: boolean;
}

const EMPTY_FORM: AddForm = { url: "", caption: "", altText: "", tags: "", isFeatured: false };

export default function AdminGalleryPage() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<AddForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState<GalleryPhoto | null>(null);

  const fetchPhotos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json() as { photos?: GalleryPhoto[] };
      setPhotos(data.photos ?? []);
    } catch {
      toast.error("Impossible de charger la galerie");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchPhotos(); }, [fetchPhotos]);

  async function handleAdd() {
    if (!form.url) { toast.error("L'URL de la photo est requise"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: form.url,
          caption: form.caption || undefined,
          altText: form.altText || undefined,
          tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
          isFeatured: form.isFeatured,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Photo ajoutée");
      setShowForm(false);
      setForm(EMPTY_FORM);
      void fetchPhotos();
    } catch {
      toast.error("Erreur lors de l'ajout");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette photo ?")) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setPhotos((prev) => prev.filter((p) => p.id !== id));
      if (selected?.id === id) setSelected(null);
      toast.success("Photo supprimée");
    } catch {
      toast.error("Impossible de supprimer");
    }
  }

  async function toggleFeatured(photo: GalleryPhoto) {
    try {
      const res = await fetch(`/api/gallery/${photo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !photo.isFeatured }),
      });
      if (!res.ok) throw new Error();
      setPhotos((prev) => prev.map((p) => p.id === photo.id ? { ...p, isFeatured: !p.isFeatured } : p));
      toast.success(photo.isFeatured ? "Retirée des favoris" : "Mise en avant");
    } catch {
      toast.error("Erreur");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-brand-beige">Galerie</h1>
          <p className="text-brand-muted mt-1">{photos.length} photos · {photos.filter((p) => p.isFeatured).length} en vedette</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Ajouter une photo
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => <div key={i} className="aspect-square rounded-xl bg-brand-charcoal animate-pulse" />)}
        </div>
      ) : photos.length === 0 ? (
        <div className="card text-center py-16">
          <Images className="w-12 h-12 text-brand-muted mx-auto mb-4" />
          <p className="text-brand-muted mb-4">La galerie est vide</p>
          <button onClick={() => setShowForm(true)} className="btn-primary">Ajouter la première photo</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
          <AnimatePresence>
            {photos.map((photo) => (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative aspect-square rounded-xl overflow-hidden bg-brand-charcoal cursor-pointer"
                onClick={() => setSelected(photo)}
              >
                <Image src={photo.url} alt={photo.altText ?? photo.caption ?? ""} fill className="object-cover" />

                {/* Overlay */}
                <div className="absolute inset-0 bg-brand-black/0 group-hover:bg-brand-black/50 transition-all flex items-end justify-between p-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={(e) => { e.stopPropagation(); void toggleFeatured(photo); }}
                    className={`p-1.5 rounded-lg transition-colors ${photo.isFeatured ? "bg-brand-gold text-brand-black" : "bg-brand-black/60 text-brand-muted hover:text-brand-gold"}`}
                  >
                    <Star className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); void handleDelete(photo.id); }}
                    className="p-1.5 rounded-lg bg-red-400/20 text-red-400 hover:bg-red-400/30 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {photo.isFeatured && (
                  <div className="absolute top-2 left-2 w-6 h-6 bg-brand-gold rounded-full flex items-center justify-center">
                    <Star className="w-3 h-3 text-brand-black fill-brand-black" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-black/90 flex items-center justify-center z-50 p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="relative max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden">
                <Image src={selected.url} alt={selected.altText ?? ""} fill className="object-contain" />
              </div>
              {selected.caption && (
                <p className="text-center text-brand-beige mt-3">{selected.caption}</p>
              )}
              {selected.tags.length > 0 && (
                <div className="flex justify-center gap-2 mt-2 flex-wrap">
                  {selected.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-brand-charcoal text-brand-muted px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Tag className="w-3 h-3" />{tag}
                    </span>
                  ))}
                </div>
              )}
              <button
                onClick={() => setSelected(null)}
                className="absolute -top-3 -right-3 w-8 h-8 bg-brand-charcoal rounded-full flex items-center justify-center text-brand-muted hover:text-brand-beige transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add photo modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-black/80 flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-brand-charcoal rounded-2xl p-6 w-full max-w-md space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-bold text-brand-beige">Ajouter une photo</h2>
                <button onClick={() => setShowForm(false)} className="text-brand-muted hover:text-brand-beige transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="label">URL de la photo *</label>
                <input
                  className="input w-full"
                  placeholder="https://..."
                  value={form.url}
                  onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                />
                <p className="text-xs text-brand-muted mt-1">Utilisez Uploadthing, Cloudinary ou toute URL publique</p>
              </div>

              {form.url && (
                <div className="relative h-40 rounded-xl overflow-hidden bg-brand-black">
                  <Image src={form.url} alt="Aperçu" fill className="object-contain" onError={() => {}} />
                </div>
              )}

              <div>
                <label className="label">Légende</label>
                <input className="input w-full" value={form.caption} onChange={(e) => setForm((f) => ({ ...f, caption: e.target.value }))} />
              </div>
              <div>
                <label className="label">Texte alternatif (accessibilité)</label>
                <input className="input w-full" value={form.altText} onChange={(e) => setForm((f) => ({ ...f, altText: e.target.value }))} />
              </div>
              <div>
                <label className="label">Tags (séparés par des virgules)</label>
                <input
                  className="input w-full"
                  placeholder="locs, retwist, coiffure afro..."
                  value={form.tags}
                  onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))} className="accent-brand-gold" />
                <span className="text-sm text-brand-muted">Mettre en vedette (apparaît sur l'accueil)</span>
              </label>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="btn-outline flex-1">Annuler</button>
                <button onClick={handleAdd} disabled={saving} className="btn-primary flex-1 disabled:opacity-60">
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
