"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import toast from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirm) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    if (form.password.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });

      if (!res.ok) {
        const err = await res.json() as { error?: string };
        throw new Error(err.error ?? "Erreur lors de l'inscription");
      }

      await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      toast.success("Bienvenue chez VicktyKof !");
      router.push("/");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-black px-4 pt-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="font-display text-3xl font-bold text-brand-gold">
            VicktyKof
          </Link>
          <h1 className="mt-4 text-2xl font-semibold text-brand-beige">Créer un compte</h1>
          <p className="mt-1 text-sm text-brand-muted">
            Déjà inscrit(e) ?{" "}
            <Link href="/login" className="text-brand-gold hover:underline">
              Se connecter
            </Link>
          </p>
        </div>

        <div className="card">
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white/5 border border-white/10 rounded-lg text-sm font-medium text-brand-beige hover:bg-white/10 transition-colors mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continuer avec Google
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-brand-muted">ou</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Nom complet</label>
              <input type="text" className="input" value={form.name} onChange={update("name")}
                placeholder="Votre nom" required autoComplete="name" />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" value={form.email} onChange={update("email")}
                placeholder="votre@email.com" required autoComplete="email" />
            </div>
            <div>
              <label className="label">Mot de passe</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} className="input pr-12"
                  value={form.password} onChange={update("password")}
                  placeholder="Min. 8 caractères" required autoComplete="new-password" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-gold">
                  {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="label">Confirmer le mot de passe</label>
              <input type="password" className="input" value={form.confirm} onChange={update("confirm")}
                placeholder="••••••••" required autoComplete="new-password" />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full gap-2 mt-2">
              {loading ? (
                <span className="w-4 h-4 border-2 border-brand-black/30 border-t-brand-black rounded-full animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              {loading ? "Création..." : "Créer mon compte"}
            </button>
          </form>

          <p className="text-xs text-brand-muted text-center mt-4">
            En vous inscrivant, vous acceptez nos{" "}
            <Link href="/terms" className="text-brand-gold hover:underline">CGU</Link>{" "}
            et notre{" "}
            <Link href="/privacy" className="text-brand-gold hover:underline">politique de confidentialité</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
