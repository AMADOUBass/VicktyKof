"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  ShoppingBag,
  Crown,
  Clock,
  CheckCircle2,
  Package,
  ChevronRight,
  Settings,
  X,
  AlertTriangle,
  Eye,
  EyeOff,
  Save,
  Phone,
  User,
  Star,
  Sparkles,
  CalendarClock,
  Trash2,
  Gift,
  CalendarPlus,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { formatPrice } from "@/lib/utils";
import { UploadDropzone } from "@/lib/uploadthing";
import { UserAvatar } from "@/components/ui/UserAvatar";

type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "ACCEPTED"
  | "DECLINED"
  | "COMPLETED"
  | "CANCELLED"
  | "RESCHEDULED";
type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

interface Appointment {
  id: string;
  status: AppointmentStatus;
  scheduledAt: string;
  durationMins: number;
  totalPrice: number;
  depositAmount: number;
  notes: string | null;
  service: { name: string; imageUrl: string | null };
  stylist: { user: { name: string | null; image: string | null } };
}

interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  product: { name: string; images: string[]; slug: string };
}

interface Order {
  id: string;
  status: OrderStatus;
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  createdAt: string;
  items: OrderItem[];
}

interface Props {
  userId: string;
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
    isMember: boolean;
    phone: string | null;
    loyaltyPoints: number;
  };
  appointments: Appointment[];
  orders: Order[];
}

const APPT_STATUS: Record<AppointmentStatus, { label: string; color: string }> =
  {
    PENDING: { label: "En attente", color: "text-yellow-400 bg-yellow-400/10" },
    CONFIRMED: { label: "Confirmé", color: "text-blue-400 bg-blue-400/10" },
    ACCEPTED: { label: "Accepté", color: "text-green-400 bg-green-400/10" },
    DECLINED: { label: "Refusé", color: "text-red-400 bg-red-400/10" },
    COMPLETED: { label: "Terminé", color: "text-brand-gold bg-brand-gold/10" },
    CANCELLED: { label: "Annulé", color: "text-brand-muted bg-brand-muted/10" },
    RESCHEDULED: {
      label: "Reprogrammé",
      color: "text-purple-400 bg-purple-400/10",
    },
  };

const ORDER_STATUS: Record<OrderStatus, { label: string; color: string }> = {
  PENDING: { label: "En attente", color: "text-yellow-400 bg-yellow-400/10" },
  PROCESSING: { label: "En traitement", color: "text-blue-400 bg-blue-400/10" },
  SHIPPED: { label: "Expédié", color: "text-purple-400 bg-purple-400/10" },
  DELIVERED: { label: "Livré", color: "text-green-400 bg-green-400/10" },
  CANCELLED: { label: "Annulé", color: "text-red-400 bg-red-400/10" },
  REFUNDED: { label: "Remboursé", color: "text-brand-muted bg-brand-muted/10" },
};

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {label}
    </span>
  );
}

function getInitials(name: string | null) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function AccountClient({
  userId,
  user,
  appointments: initialAppointments,
  orders,
}: Props) {
  const router = useRouter();
  const { update } = useSession();
  const [tab, setTab] = useState<"appointments" | "orders" | "profile">(
    "appointments",
  );
  const [appointments, setAppointments] = useState(initialAppointments);

  // Profile edit state
  const [profileName, setProfileName] = useState(user.name ?? "");
  const [profilePhone, setProfilePhone] = useState(user.phone ?? "");
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user.image ?? "");

  // Cancel appointment state
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);

  // Review state
  const [reviewTarget, setReviewTarget] = useState<{
    type: "appointment" | "product";
    name: string;
    productId?: string;
  } | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewBody, setReviewBody] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  // Membership
  const [memberLoading, setMemberLoading] = useState(false);
  const [isMember, setIsMember] = useState(user.isMember);

  // Reschedule state
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [rescheduleLoading, setRescheduleLoading] = useState(false);

  // Account deletion
  const [showDeleteZone, setShowDeleteZone] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);

  async function handleSaveProfile() {
    setSavingProfile(true);
    try {
      const body: Record<string, string> = {};
      if (profileName !== user.name) body.name = profileName;
      if (profilePhone !== (user.phone ?? "")) body.phone = profilePhone || "";
      if (newPw) {
        if (newPw !== confirmPw) {
          toast.error("Les mots de passe ne correspondent pas");
          setSavingProfile(false);
          return;
        }
        if (newPw.length < 8) {
          toast.error("Minimum 8 caractères");
          setSavingProfile(false);
          return;
        }
        body.currentPassword = currentPw;
        body.newPassword = newPw;
      }
      if (Object.keys(body).length === 0) {
        toast.success("Aucune modification");
        setSavingProfile(false);
        return;
      }

      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        throw new Error(err.error ?? "Erreur");
      }
      toast.success("Profil mis à jour");
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleCancelAppointment() {
    if (!cancellingId || !cancelReason.trim()) {
      toast.error("Veuillez indiquer une raison");
      return;
    }
    setCancelLoading(true);
    try {
      const res = await fetch(`/api/appointments/${cancellingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "CANCELLED",
          cancelReason: cancelReason.trim(),
        }),
      });
      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        throw new Error(err.error ?? "Erreur");
      }
      toast.success("Rendez-vous annulé");
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === cancellingId
            ? { ...a, status: "CANCELLED" as AppointmentStatus }
            : a,
        ),
      );
      setCancellingId(null);
      setCancelReason("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    } finally {
      setCancelLoading(false);
    }
  }

  async function handleSubmitReview() {
    if (!reviewTarget) return;
    setReviewLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: reviewTarget.productId,
          rating: reviewRating,
          body: reviewBody.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        throw new Error(err.error ?? "Erreur");
      }
      toast.success("Merci pour votre avis !");
      setReviewTarget(null);
      setReviewRating(5);
      setReviewBody("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    } finally {
      setReviewLoading(false);
    }
  }

  async function handleActivateMembership() {
    setMemberLoading(true);
    try {
      const res = await fetch("/api/membership", { method: "POST" });
      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        throw new Error(err.error ?? "Erreur");
      }
      toast.success("Bienvenue dans le club VicktyKof !");
      setIsMember(true);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    } finally {
      setMemberLoading(false);
    }
  }

  async function handleReschedule() {
    if (!rescheduleId || !rescheduleDate || !rescheduleTime) {
      toast.error("Sélectionnez une date et une heure");
      return;
    }
    setRescheduleLoading(true);
    try {
      const scheduledAt = new Date(
        `${rescheduleDate}T${rescheduleTime}:00`,
      ).toISOString();
      const res = await fetch(`/api/appointments/${rescheduleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "RESCHEDULED", scheduledAt }),
      });
      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        throw new Error(err.error ?? "Erreur");
      }
      toast.success("Rendez-vous reprogrammé — en attente de confirmation");
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === rescheduleId
            ? { ...a, status: "PENDING" as AppointmentStatus, scheduledAt }
            : a,
        ),
      );
      setRescheduleId(null);
      setRescheduleDate("");
      setRescheduleTime("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    } finally {
      setRescheduleLoading(false);
    }
  }

  const upcoming = appointments.filter(
    (a) =>
      ["PENDING", "CONFIRMED", "ACCEPTED"].includes(a.status) &&
      new Date(a.scheduledAt) >= new Date(),
  );
  const past = appointments.filter((a) => !upcoming.includes(a));

  return (
    <div className="min-h-screen bg-brand-black pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          <div
            className="relative group cursor-pointer"
            onClick={() => setTab("profile")}>
            <UserAvatar 
              src={avatarUrl} 
              name={user.name} 
              size="xl" 
            />
            <div className="absolute inset-0 bg-brand-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-full">
              <User className="w-6 h-6 text-brand-gold" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display text-2xl font-bold text-brand-beige">
                {user.name ?? "Mon compte"}
              </h1>
              {isMember && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-brand-gold bg-brand-gold/10 border border-brand-gold/20 px-2.5 py-0.5 rounded-full">
                  <Crown className="w-3 h-3" />
                  Membre VicktyKof
                </span>
              )}
            </div>
            <p className="text-brand-muted text-sm mt-0.5">{user.email}</p>
          </div>
          <div className="flex gap-4 text-center">
            <div>
              <p className="font-display text-2xl font-bold text-brand-gold">
                {appointments.length}
              </p>
              <p className="text-xs text-brand-muted">RDV</p>
            </div>
            <div className="border-l border-brand-charcoal pl-4">
              <p className="font-display text-2xl font-bold text-brand-gold">
                {orders.length}
              </p>
              <p className="text-xs text-brand-muted">Commandes</p>
            </div>
            <div className="border-l border-brand-charcoal pl-4">
              <p className="font-display text-2xl font-bold text-brand-gold flex items-center gap-1 justify-center">
                <Gift className="w-4 h-4" />
                {user.loyaltyPoints}
              </p>
              <p className="text-xs text-brand-muted">Points</p>
            </div>
          </div>
        </motion.div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Link
            href="/booking"
            className="card card-hover flex items-center gap-3 group">
            <div className="w-10 h-10 bg-brand-gold/10 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-brand-gold" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-brand-beige group-hover:text-brand-gold transition-colors">
                Prendre un rendez-vous
              </p>
              <p className="text-xs text-brand-muted">
                Réservez avec votre styliste
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-brand-muted group-hover:text-brand-gold transition-colors" />
          </Link>
          <Link
            href="/shop"
            className="card card-hover flex items-center gap-3 group">
            <div className="w-10 h-10 bg-brand-gold/10 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-brand-gold" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-brand-beige group-hover:text-brand-gold transition-colors">
                Boutique
              </p>
              <p className="text-xs text-brand-muted">Produits capillaires</p>
            </div>
            <ChevronRight className="w-4 h-4 text-brand-muted group-hover:text-brand-gold transition-colors" />
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-brand-charcoal rounded-xl p-1 mb-6 w-fit overflow-x-auto">
          {(["appointments", "orders", "profile"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                tab === t
                  ? "bg-brand-gold text-brand-black"
                  : "text-brand-muted hover:text-brand-beige"
              }`}>
              {t === "appointments" ? (
                <>
                  <Calendar className="w-4 h-4" />
                  Rendez-vous
                </>
              ) : t === "orders" ? (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  Commandes
                </>
              ) : (
                <>
                  <Settings className="w-4 h-4" />
                  Mon profil
                </>
              )}
            </button>
          ))}
        </div>

        {/* Appointments tab */}
        {tab === "appointments" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6">
            {upcoming.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-gold" />À venir (
                  {upcoming.length})
                </h2>
                <div className="space-y-3">
                  {upcoming.map((a) => (
                    <ApptCard
                      key={a.id}
                      a={a}
                      onCancel={(id) => setCancellingId(id)}
                      onReschedule={(id) => setRescheduleId(id)}
                    />
                  ))}
                </div>
              </section>
            )}
            {past.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-widest mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-muted" />
                  Historique
                </h2>
                <div className="space-y-3">
                  {past.map((a) => (
                    <ApptCard
                      key={a.id}
                      a={a}
                      onReview={(appt) =>
                        setReviewTarget({
                          type: "appointment",
                          name: appt.service.name,
                        })
                      }
                    />
                  ))}
                </div>
              </section>
            )}
            {appointments.length === 0 && (
              <Empty
                icon={<Calendar className="w-8 h-8 text-brand-muted" />}
                title="Aucun rendez-vous"
                description="Réservez votre première séance avec nos stylistes."
                action={{ href: "/booking", label: "Prendre un rendez-vous" }}
              />
            )}
          </motion.div>
        )}

        {/* Orders tab */}
        {tab === "orders" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4">
            {orders.length === 0 ? (
              <Empty
                icon={<ShoppingBag className="w-8 h-8 text-brand-muted" />}
                title="Aucune commande"
                description="Explorez notre boutique de produits capillaires."
                action={{ href: "/shop", label: "Voir la boutique" }}
              />
            ) : (
              orders.map((o) => <OrderCard key={o.id} order={o} />)
            )}
          </motion.div>
        )}

        {/* Profile tab */}
        {tab === "profile" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6">
            <div className="card">
              <h2 className="font-display text-xl font-semibold text-brand-beige flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-brand-gold" /> Informations
                personnelles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Nom complet</label>
                  <input
                    className="input"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="label">Téléphone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                    <input
                      className="input pl-10"
                      placeholder="(581) 000-0000"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="label">Email</label>
                  <input
                    className="input opacity-60 cursor-not-allowed"
                    value={user.email ?? ""}
                    disabled
                  />
                  <p className="text-xs text-brand-muted mt-1">
                    L&apos;email ne peut pas être modifié.
                  </p>
                </div>
              </div>
            </div>

            <div className="card space-y-4">
              <h2 className="font-display text-xl font-semibold text-brand-beige flex items-center gap-2">
                <Image
                  className="w-5 h-5 text-brand-gold"
                  src="/favicon.png"
                  alt=""
                  width={20}
                  height={20}
                />{" "}
                Photo de profil
              </h2>
              <UploadDropzone
                endpoint="avatarUploader"
                onClientUploadComplete={async (res) => {
                  if (res?.[0]) {
                    const newUrl = res[0].url;
                    setAvatarUrl(newUrl);
                    toast.success("Photo téléversée !");
                    // Save to user api immediately
                    try {
                      await fetch(`/api/users/${userId}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ image: newUrl }),
                      });
                      await update({ image: newUrl }); // Update NextAuth cookie
                      router.refresh(); // Refresh layout
                    } catch {
                      toast.error("Erreur de sauvegarde");
                    }
                  }
                }}
                onUploadError={(error: Error) => {
                  toast.error(`Erreur: ${error.message}`);
                }}
                appearance={{
                  container:
                    "border-brand-gold/30 hover:border-brand-gold transition-colors bg-brand-charcoal cursor-pointer",
                  uploadIcon: "text-brand-gold",
                  label:
                    "text-brand-gold hover:text-brand-beige transition-colors",
                  allowedContent: "text-brand-muted",
                  button:
                    "bg-brand-gold text-brand-black font-semibold ut-uploading:opacity-50",
                }}
              />
            </div>

            <div className="card">
              <div className="mb-4">
                <h2 className="font-display text-xl font-semibold text-brand-beige">
                  Changer le mot de passe
                </h2>
                <p className="text-xs text-brand-muted mt-1">
                  Laissez vide si vous ne souhaitez pas changer de mot de passe.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="label">Mot de passe actuel</label>
                  <input
                    type="password"
                    className="input md:w-1/2"
                    value={currentPw}
                    onChange={(e) => setCurrentPw(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="label">Nouveau mot de passe</label>
                  <div className="relative">
                    <input
                      type={showPw ? "text" : "password"}
                      className="input pr-12"
                      value={newPw}
                      onChange={(e) => setNewPw(e.target.value)}
                      placeholder="Min. 8 caractères"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-gold">
                      {showPw ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="label">Confirmer</label>
                  <input
                    type="password"
                    className="input"
                    value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSaveProfile}
              disabled={savingProfile}
              className="btn-primary w-full gap-2">
              {savingProfile ? (
                <span className="w-4 h-4 border-2 border-brand-black/30 border-t-brand-black rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {savingProfile
                ? "Sauvegarde..."
                : "Sauvegarder les modifications"}
            </button>

            {/* Membership CTA */}
            {!isMember && (
              <div className="card border border-brand-gold/20 bg-brand-gold/5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-gold/10 rounded-xl flex items-center justify-center shrink-0">
                    <Sparkles className="w-6 h-6 text-brand-gold" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-semibold text-brand-beige">
                      Devenir membre VicktyKof
                    </h3>
                    <p className="text-sm text-brand-muted mt-1">
                      Accédez à des prix exclusifs sur les produits,
                      des offres spéciales et une expérience
                      personnalisée. C&apos;est gratuit !
                    </p>
                    <button
                      onClick={handleActivateMembership}
                      disabled={memberLoading}
                      className="btn-primary mt-4 gap-2 text-sm">
                      {memberLoading ? (
                        <span className="w-4 h-4 border-2 border-brand-black/30 border-t-brand-black rounded-full animate-spin" />
                      ) : (
                        <Crown className="w-4 h-4" />
                      )}
                      {memberLoading
                        ? "Activation..."
                        : "Devenir membre — Gratuit"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Danger zone: Account deletion */}
            <div className="border border-red-500/20 rounded-2xl p-5 mt-6">
              <button
                onClick={() => setShowDeleteZone(!showDeleteZone)}
                className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors w-full justify-between">
                <span className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4" /> Supprimer mon compte
                </span>
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${showDeleteZone ? "rotate-90" : ""}`}
                />
              </button>
              {showDeleteZone && (
                <div className="mt-4 space-y-3">
                  <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
                    <p className="text-sm text-red-400 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      Cette action est irréversible. Votre compte sera anonymisé
                      et tous vos rendez-vous en attente seront annulés.
                    </p>
                  </div>
                  <div>
                    <label className="label">Tapez DELETE pour confirmer</label>
                    <input
                      className="input"
                      placeholder="DELETE"
                      value={deleteConfirm}
                      onChange={(e) => setDeleteConfirm(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={async () => {
                      if (deleteConfirm !== "DELETE") {
                        toast.error("Tapez DELETE pour confirmer");
                        return;
                      }
                      setDeleting(true);
                      try {
                        const res = await fetch("/api/account", {
                          method: "DELETE",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ confirmation: "DELETE" }),
                        });
                        if (!res.ok) throw new Error();
                        toast.success("Compte supprimé");
                        await signOut({ callbackUrl: "/" });
                      } catch {
                        toast.error("Erreur lors de la suppression");
                      } finally {
                        setDeleting(false);
                      }
                    }}
                    disabled={deleting || deleteConfirm !== "DELETE"}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white font-semibold rounded-lg transition-all duration-300 hover:bg-red-600 active:scale-95 disabled:opacity-50">
                    {deleting
                      ? "Suppression..."
                      : "Supprimer définitivement mon compte"}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Cancel appointment modal */}
        <AnimatePresence>
          {cancellingId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-brand-black/80 flex items-center justify-center z-50 p-4"
              onClick={(e) =>
                e.target === e.currentTarget && setCancellingId(null)
              }>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-brand-charcoal rounded-2xl p-6 w-full max-w-md space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-xl font-bold text-brand-beige flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" /> Annuler
                    le rendez-vous
                  </h2>
                  <button
                    onClick={() => setCancellingId(null)}
                    className="text-brand-muted hover:text-brand-beige">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm text-brand-muted">
                  Cette action est irréversible. Votre dépôt pourrait ne pas
                  être remboursé selon les conditions d&apos;annulation.
                </p>
                <div>
                  <label className="label">Raison de l&apos;annulation *</label>
                  <textarea
                    className="input min-h-[80px] resize-none"
                    placeholder="Indiquez la raison..."
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setCancellingId(null)}
                    className="btn-outline flex-1">
                    Garder le RDV
                  </button>
                  <button
                    onClick={handleCancelAppointment}
                    disabled={cancelLoading || !cancelReason.trim()}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white font-semibold rounded-lg transition-all duration-300 hover:bg-red-600 active:scale-95 disabled:opacity-50">
                    {cancelLoading ? "Annulation..." : "Confirmer l'annulation"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Review modal */}
        <AnimatePresence>
          {reviewTarget && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-brand-black/80 flex items-center justify-center z-50 p-4"
              onClick={(e) =>
                e.target === e.currentTarget && setReviewTarget(null)
              }>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-brand-charcoal rounded-2xl p-6 w-full max-w-md space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-xl font-bold text-brand-beige">
                    Laisser un avis
                  </h2>
                  <button
                    onClick={() => setReviewTarget(null)}
                    className="text-brand-muted hover:text-brand-beige">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm text-brand-muted">
                  Pour :{" "}
                  <span className="text-brand-beige font-medium">
                    {reviewTarget.name}
                  </span>
                </p>
                <div>
                  <label className="label">Note</label>
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        onClick={() => setReviewRating(n)}
                        className="transition-transform hover:scale-110">
                        <Star
                          className={`w-7 h-7 ${n <= reviewRating ? "text-brand-gold fill-brand-gold" : "text-brand-muted"}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="label">Commentaire (optionnel)</label>
                  <textarea
                    className="input min-h-[80px] resize-none"
                    placeholder="Votre exp\u00e9rience..."
                    value={reviewBody}
                    onChange={(e) => setReviewBody(e.target.value)}
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setReviewTarget(null)}
                    className="btn-outline flex-1">
                    Annuler
                  </button>
                  <button
                    onClick={handleSubmitReview}
                    disabled={reviewLoading}
                    className="btn-primary flex-1 gap-2">
                    {reviewLoading ? "Envoi..." : "Envoyer l'avis"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reschedule modal */}
        <AnimatePresence>
          {rescheduleId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-brand-black/80 flex items-center justify-center z-50 p-4"
              onClick={(e) =>
                e.target === e.currentTarget && setRescheduleId(null)
              }>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-brand-charcoal rounded-2xl p-6 w-full max-w-md space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-xl font-bold text-brand-beige flex items-center gap-2">
                    <CalendarClock className="w-5 h-5 text-blue-400" />{" "}
                    Reprogrammer
                  </h2>
                  <button
                    onClick={() => setRescheduleId(null)}
                    className="text-brand-muted hover:text-brand-beige">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm text-brand-muted">
                  Choisissez une nouvelle date et heure. Votre rendez-vous sera
                  remis en attente de confirmation.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Date</label>
                    <input
                      type="date"
                      className="input"
                      min={new Date().toISOString().split("T")[0]}
                      value={rescheduleDate}
                      onChange={(e) => setRescheduleDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label">Heure</label>
                    <input
                      type="time"
                      className="input"
                      value={rescheduleTime}
                      onChange={(e) => setRescheduleTime(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setRescheduleId(null)}
                    className="btn-outline flex-1">
                    Annuler
                  </button>
                  <button
                    onClick={handleReschedule}
                    disabled={
                      rescheduleLoading || !rescheduleDate || !rescheduleTime
                    }
                    className="btn-primary flex-1 gap-2">
                    {rescheduleLoading ? "Envoi..." : "Reprogrammer"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ApptCard({
  a,
  onCancel,
  onReview,
  onReschedule,
}: {
  a: Appointment;
  onCancel?: (id: string) => void;
  onReview?: (a: Appointment) => void;
  onReschedule?: (id: string) => void;
}) {
  const s = APPT_STATUS[a.status];
  const date = new Date(a.scheduledAt);
  const isCancellable =
    ["PENDING", "CONFIRMED", "ACCEPTED"].includes(a.status) &&
    date >= new Date();
  const isReviewable = a.status === "COMPLETED";

  function generateICS() {
    const end = new Date(date.getTime() + a.durationMins * 60000);
    const formatDate = (d: Date) =>
      d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const ics = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${formatDate(date)}
DTEND:${formatDate(end)}
SUMMARY:Rendez-vous VicktyKof - ${a.service.name}
DESCRIPTION:Styliste: ${a.stylist.user.name ?? "Styliste"}\\nNotes: ${a.notes ?? ""}
END:VEVENT
END:VCALENDAR`;
    return `data:text/calendar;charset=utf8,${encodeURIComponent(ics)}`;
  }

  return (
    <div
      className={`card flex flex-col sm:flex-row sm:items-center gap-4 ${date < new Date() && !["PENDING", "CONFIRMED", "ACCEPTED"].includes(a.status) ? "opacity-70" : ""}`}>
      <div className="w-12 h-12 bg-brand-gold/10 rounded-xl flex flex-col items-center justify-center text-brand-gold shrink-0">
        <span className="text-xs font-bold leading-none">
          {date.toLocaleDateString("fr-CA", { month: "short" }).toUpperCase()}
        </span>
        <span className="font-display text-lg font-bold leading-none">
          {date.getDate()}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <p className="font-medium text-brand-beige">{a.service.name}</p>
          <Badge {...s} />
        </div>
        <p className="text-sm text-brand-muted">
          avec {a.stylist.user.name ?? "Styliste"} ·{" "}
          {date.toLocaleTimeString("fr-CA", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        {a.notes && (
          <p className="text-xs text-brand-muted mt-1 italic truncate">
            Note : {a.notes}
          </p>
        )}
        {isCancellable && (
          <a
            href={generateICS()}
            download="rendez-vous.ics"
            className="inline-flex items-center gap-1.5 text-xs text-brand-muted hover:text-brand-beige transition-colors mt-2">
            <CalendarPlus className="w-3.5 h-3.5" /> Ajouter au calendrier
          </a>
        )}
      </div>
      <div className="text-right shrink-0 space-y-1">
        <p className="font-semibold text-brand-beige">
          {formatPrice(a.totalPrice)}
        </p>
        <p className="text-xs text-brand-muted">
          Dépôt : {formatPrice(a.depositAmount)}
        </p>
        <div className="flex items-center gap-2 justify-end">
          {isCancellable && onReschedule && (
            <button
              onClick={() => onReschedule(a.id)}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-2">
              Reprogrammer
            </button>
          )}
          {isCancellable && onCancel && (
            <button
              onClick={() => onCancel(a.id)}
              className="text-xs text-red-400 hover:text-red-300 transition-colors underline underline-offset-2">
              Annuler
            </button>
          )}
        </div>
        {isReviewable && onReview && (
          <button
            onClick={() => onReview(a)}
            className="text-xs text-brand-gold hover:text-brand-gold-light transition-colors mt-1 underline underline-offset-2 flex items-center gap-1 ml-auto">
            <Star className="w-3 h-3" /> Avis
          </button>
        )}
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const s = ORDER_STATUS[order.status];
  const [open, setOpen] = useState(false);
  return (
    <div className="card space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-medium text-brand-beige">
              Commande #{order.id.slice(-8).toUpperCase()}
            </p>
            <Badge {...s} />
          </div>
          <p className="text-xs text-brand-muted mt-0.5">
            {new Date(order.createdAt).toLocaleDateString("fr-CA", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            {" · "}
            {order.items.length} article{order.items.length > 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <p className="font-semibold text-brand-gold">
            {formatPrice(order.total)}
          </p>
          <button
            onClick={() => setOpen((o) => !o)}
            className="text-xs text-brand-muted hover:text-brand-gold transition-colors underline">
            {open ? "Masquer" : "Détails"}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-brand-charcoal pt-3 space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-charcoal overflow-hidden relative shrink-0">
                {item.product.images[0] ? (
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-4 h-4 text-brand-muted" />
                  </div>
                )}
              </div>
              <Link
                href={`/shop/${item.product.slug}`}
                className="flex-1 text-sm text-brand-beige hover:text-brand-gold transition-colors truncate">
                {item.product.name}
              </Link>
              <span className="text-xs text-brand-muted shrink-0">
                {item.quantity} × {formatPrice(item.unitPrice)}
              </span>
            </div>
          ))}
          <div className="border-t border-brand-charcoal pt-2 space-y-1 text-xs text-brand-muted">
            <div className="flex justify-between">
              <span>Sous-total</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>TPS+TVQ</span>
              <span>{formatPrice(order.tax)}</span>
            </div>
            <div className="flex justify-between">
              <span>Livraison</span>
              <span>
                {order.shipping === 0
                  ? "Gratuite"
                  : formatPrice(order.shipping)}
              </span>
            </div>
            <div className="flex justify-between font-semibold text-brand-beige text-sm pt-1">
              <span>Total</span>
              <span className="text-brand-gold">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Empty({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: { href: string; label: string };
}) {
  return (
    <div className="card text-center py-12 space-y-4">
      <div className="w-14 h-14 bg-brand-charcoal rounded-full flex items-center justify-center mx-auto">
        {icon}
      </div>
      <div>
        <p className="font-medium text-brand-beige">{title}</p>
        <p className="text-sm text-brand-muted mt-1">{description}</p>
      </div>
      <Link href={action.href} className="btn-primary inline-block">
        {action.label}
      </Link>
    </div>
  );
}
