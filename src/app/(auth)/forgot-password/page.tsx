"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      // Always show success (avoid email enumeration)
      setSent(true);
    } catch {
      toast.error("Erreur réseau, veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="font-display text-3xl font-bold text-brand-gold">
            VicktyKof
          </Link>
          <p className="text-brand-muted text-sm mt-1">Salon de coiffure afro</p>
        </div>

        <div className="card">
          {sent ? (
            <div className="text-center py-4 space-y-4">
              <CheckCircle2 className="w-14 h-14 text-green-400 mx-auto" />
              <h1 className="font-display text-2xl font-bold text-brand-beige">
                Vérifiez vos emails
              </h1>
              <p className="text-brand-muted text-sm">
                Si un compte existe pour{" "}
                <span className="text-brand-beige">{email}</span>, vous
                recevrez un lien de réinitialisation dans quelques minutes.
              </p>
              <p className="text-xs text-brand-muted">
                Pensez à vérifier vos spams.
              </p>
              <Link href="/login" className="btn-primary inline-block mt-4">
                Retour à la connexion
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="font-display text-2xl font-bold text-brand-beige">
                  Mot de passe oublié
                </h1>
                <p className="text-brand-muted text-sm mt-1">
                  Entrez votre adresse email et nous vous enverrons un lien de
                  réinitialisation.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Adresse email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                    <input
                      type="email"
                      className="input pl-10"
                      placeholder="vous@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full gap-2"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-brand-black/30 border-t-brand-black rounded-full animate-spin" />
                  ) : null}
                  {loading ? "Envoi…" : "Envoyer le lien"}
                </button>
              </form>

              <Link
                href="/login"
                className="mt-5 flex items-center justify-center gap-2 text-sm text-brand-muted hover:text-brand-beige transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Retour à la connexion
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
