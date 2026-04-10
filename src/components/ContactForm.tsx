"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import toast from "react-hot-toast";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const update = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success("Message envoyé ! Nous vous répondrons sous 24h.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      toast.error("Erreur lors de l'envoi. Essayez par email directement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Nom</label>
          <input type="text" className="input" value={form.name} onChange={update("name")}
            placeholder="Votre nom" required />
        </div>
        <div>
          <label className="label">Email</label>
          <input type="email" className="input" value={form.email} onChange={update("email")}
            placeholder="votre@email.com" required />
        </div>
      </div>

      <div>
        <label className="label">Sujet</label>
        <select className="input" value={form.subject} onChange={update("subject")} required>
          <option value="">Choisir un sujet...</option>
          <option value="reservation">Rendez-vous / Réservation</option>
          <option value="produit">Question sur un produit</option>
          <option value="remboursement">Remboursement</option>
          <option value="autre">Autre</option>
        </select>
      </div>

      <div>
        <label className="label">Message</label>
        <textarea
          className="input min-h-36 resize-none"
          value={form.message}
          onChange={update("message")}
          placeholder="Votre message..."
          required
        />
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full gap-2">
        {loading ? (
          <span className="w-4 h-4 border-2 border-brand-black/30 border-t-brand-black rounded-full animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
        {loading ? "Envoi..." : "Envoyer le message"}
      </button>
    </form>
  );
}
