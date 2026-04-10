"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  Crown,
  AlertTriangle,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  comparePrice: number | null;
  stock: number;
  sku: string | null;
  images: string[];
  isFeatured: boolean;
  isMemberOnly: boolean;
  memberPrice: number | null;
  isActive: boolean;
  category: { name: string; slug: string };
}

interface FormData {
  name: string;
  slug: string;
  description: string;
  price: string;
  comparePrice: string;
  stock: string;
  sku: string;
  images: string;
  isFeatured: boolean;
  isMemberOnly: boolean;
  memberPrice: string;
  categoryId: string;
}

const EMPTY_FORM: FormData = {
  name: "",
  slug: "",
  description: "",
  price: "",
  comparePrice: "",
  stock: "0",
  sku: "",
  images: "",
  isFeatured: false,
  isMemberOnly: false,
  memberPrice: "",
  categoryId: "",
};

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([
        fetch("/api/products?limit=100"),
        fetch("/api/products/categories").catch(() => null),
      ]);
      const pData = await pRes.json() as { products?: Product[] };
      setProducts(pData.products ?? []);

      // Fallback: extract categories from products
      if (cRes?.ok) {
        const cData = await cRes.json() as Category[];
        setCategories(cData);
      } else {
        const seen = new Set<string>();
        const cats: Category[] = [];
        for (const p of pData.products ?? []) {
          if (!seen.has(p.category.slug)) {
            seen.add(p.category.slug);
            cats.push({ id: p.category.slug, name: p.category.name, slug: p.category.slug });
          }
        }
        setCategories(cats);
      }
    } catch {
      toast.error("Impossible de charger les produits");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  function openCreate() {
    setEditId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function openEdit(product: Product) {
    setEditId(product.id);
    setForm({
      name: product.name,
      slug: product.slug,
      description: product.description ?? "",
      price: product.price.toString(),
      comparePrice: product.comparePrice?.toString() ?? "",
      stock: product.stock.toString(),
      sku: product.sku ?? "",
      images: product.images.join("\n"),
      isFeatured: product.isFeatured,
      isMemberOnly: product.isMemberOnly,
      memberPrice: product.memberPrice?.toString() ?? "",
      categoryId: product.category.slug,
    });
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.name || !form.price || !form.stock) {
      toast.error("Nom, prix et stock sont requis");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        slug: form.slug || slugify(form.name),
        description: form.description || undefined,
        price: parseFloat(form.price),
        comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : undefined,
        stock: parseInt(form.stock, 10),
        sku: form.sku || undefined,
        images: form.images.split("\n").map((s) => s.trim()).filter(Boolean),
        isFeatured: form.isFeatured,
        isMemberOnly: form.isMemberOnly,
        memberPrice: form.memberPrice ? parseFloat(form.memberPrice) : undefined,
        categoryId: form.categoryId || undefined,
      };

      const res = await fetch(editId ? `/api/products/${editId}` : "/api/products", {
        method: editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json() as { error?: string };
        toast.error(err.error ?? "Erreur lors de l'enregistrement");
        return;
      }

      toast.success(editId ? "Produit mis à jour" : "Produit créé");
      setShowForm(false);
      void fetchProducts();
    } catch {
      toast.error("Erreur réseau");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Désactiver "${name}" ?`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Produit désactivé");
    } catch {
      toast.error("Impossible de supprimer le produit");
    }
  }

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    return (
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.sku?.toLowerCase().includes(q) ||
      p.category.name.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-brand-beige">Produits</h1>
          <p className="text-brand-muted mt-1">{products.length} produits actifs</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nouveau produit
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
        <input
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-10 w-full max-w-md"
        />
      </div>

      {/* Product grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card h-48 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-12">
          <Package className="w-10 h-10 text-brand-muted mx-auto mb-3" />
          <p className="text-brand-muted">Aucun produit trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card card-hover group"
            >
              {/* Image */}
              <div className="relative h-36 rounded-xl overflow-hidden bg-brand-charcoal mb-3">
                {product.images[0] ? (
                  <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-8 h-8 text-brand-muted" />
                  </div>
                )}
                {product.isMemberOnly && (
                  <div className="absolute top-2 left-2 flex items-center gap-1 bg-brand-gold text-brand-black text-xs font-bold px-2 py-0.5 rounded-full">
                    <Crown className="w-3 h-3" />
                    Membres
                  </div>
                )}
                {product.stock <= 5 && product.stock > 0 && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-yellow-400/90 text-brand-black text-xs font-bold px-2 py-0.5 rounded-full">
                    <AlertTriangle className="w-3 h-3" />
                    {product.stock}
                  </div>
                )}
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-brand-black/60 flex items-center justify-center">
                    <span className="text-sm font-semibold text-red-400">Épuisé</span>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-brand-beige text-sm line-clamp-1">{product.name}</p>
                  <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEdit(product)}
                      className="p-1.5 rounded-lg bg-brand-gold/10 text-brand-gold hover:bg-brand-gold/20 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id, product.name)}
                      className="p-1.5 rounded-lg bg-red-400/10 text-red-400 hover:bg-red-400/20 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-brand-muted">{product.category.name}</p>
                <div className="flex items-center justify-between">
                  <span className="text-brand-gold font-semibold text-sm">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-xs text-brand-muted">Stock : {product.stock}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Form modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-black/80 flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-brand-charcoal rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-bold text-brand-beige">
                  {editId ? "Modifier le produit" : "Nouveau produit"}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-brand-muted hover:text-brand-beige transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="label">Nom *</label>
                  <input
                    className="input w-full"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))}
                  />
                </div>
                <div>
                  <label className="label">Slug</label>
                  <input
                    className="input w-full"
                    value={form.slug}
                    onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="label">Description</label>
                  <textarea
                    className="input w-full h-20 resize-none"
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Prix (CAD) *</label>
                    <input
                      type="number"
                      step="0.01"
                      className="input w-full"
                      value={form.price}
                      onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="label">Prix barré</label>
                    <input
                      type="number"
                      step="0.01"
                      className="input w-full"
                      value={form.comparePrice}
                      onChange={(e) => setForm((f) => ({ ...f, comparePrice: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Stock *</label>
                    <input
                      type="number"
                      className="input w-full"
                      value={form.stock}
                      onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="label">SKU</label>
                    <input
                      className="input w-full"
                      value={form.sku}
                      onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Images (URLs, une par ligne)</label>
                  <textarea
                    className="input w-full h-20 resize-none font-mono text-xs"
                    value={form.images}
                    onChange={(e) => setForm((f) => ({ ...f, images: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="label">Catégorie</label>
                  <select
                    className="input w-full"
                    value={form.categoryId}
                    onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
                  >
                    <option value="">— Sélectionner —</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Prix membre (CAD)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="input w-full"
                    value={form.memberPrice}
                    onChange={(e) => setForm((f) => ({ ...f, memberPrice: e.target.value }))}
                  />
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isFeatured}
                      onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))}
                      className="w-4 h-4 accent-brand-gold"
                    />
                    <span className="text-sm text-brand-muted">Coup de cœur</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isMemberOnly}
                      onChange={(e) => setForm((f) => ({ ...f, isMemberOnly: e.target.checked }))}
                      className="w-4 h-4 accent-brand-gold"
                    />
                    <span className="text-sm text-brand-muted">Membres seulement</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowForm(false)}
                  className="btn-outline flex-1"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary flex-1 disabled:opacity-60"
                >
                  {saving ? "Enregistrement..." : editId ? "Mettre à jour" : "Créer"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
