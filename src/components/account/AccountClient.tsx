"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar, ShoppingBag, Crown, Clock, CheckCircle2, Package, ChevronRight,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

type AppointmentStatus = "PENDING" | "CONFIRMED" | "ACCEPTED" | "DECLINED" | "COMPLETED" | "CANCELLED" | "RESCHEDULED";
type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";

interface Appointment {
  id: string;
  status: AppointmentStatus;
  scheduledAt: string;
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
  user: { name: string | null; email: string | null; image: string | null; isMember: boolean };
  appointments: Appointment[];
  orders: Order[];
}

const APPT_STATUS: Record<AppointmentStatus, { label: string; color: string }> = {
  PENDING:     { label: "En attente",    color: "text-yellow-400 bg-yellow-400/10" },
  CONFIRMED:   { label: "Confirmé",      color: "text-blue-400 bg-blue-400/10" },
  ACCEPTED:    { label: "Accepté",       color: "text-green-400 bg-green-400/10" },
  DECLINED:    { label: "Refusé",        color: "text-red-400 bg-red-400/10" },
  COMPLETED:   { label: "Terminé",       color: "text-brand-gold bg-brand-gold/10" },
  CANCELLED:   { label: "Annulé",        color: "text-brand-muted bg-brand-muted/10" },
  RESCHEDULED: { label: "Reprogrammé",   color: "text-purple-400 bg-purple-400/10" },
};

const ORDER_STATUS: Record<OrderStatus, { label: string; color: string }> = {
  PENDING:    { label: "En attente",     color: "text-yellow-400 bg-yellow-400/10" },
  PROCESSING: { label: "En traitement",  color: "text-blue-400 bg-blue-400/10" },
  SHIPPED:    { label: "Expédié",        color: "text-purple-400 bg-purple-400/10" },
  DELIVERED:  { label: "Livré",          color: "text-green-400 bg-green-400/10" },
  CANCELLED:  { label: "Annulé",         color: "text-red-400 bg-red-400/10" },
  REFUNDED:   { label: "Remboursé",      color: "text-brand-muted bg-brand-muted/10" },
};

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {label}
    </span>
  );
}

function getInitials(name: string | null) {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export function AccountClient({ user, appointments, orders }: Props) {
  const [tab, setTab] = useState<"appointments" | "orders">("appointments");

  const upcoming = appointments.filter(
    (a) => ["PENDING", "CONFIRMED", "ACCEPTED"].includes(a.status) && new Date(a.scheduledAt) >= new Date()
  );
  const past = appointments.filter((a) => !upcoming.includes(a));

  return (
    <div className="min-h-screen bg-brand-black pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8"
        >
          <div className="w-16 h-16 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold font-bold text-xl shrink-0 overflow-hidden">
            {user.image
              ? <Image src={user.image} alt="" width={64} height={64} className="rounded-full object-cover" />
              : getInitials(user.name)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display text-2xl font-bold text-brand-beige">
                {user.name ?? "Mon compte"}
              </h1>
              {user.isMember && (
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
              <p className="font-display text-2xl font-bold text-brand-gold">{appointments.length}</p>
              <p className="text-xs text-brand-muted">RDV</p>
            </div>
            <div className="border-l border-brand-charcoal pl-4">
              <p className="font-display text-2xl font-bold text-brand-gold">{orders.length}</p>
              <p className="text-xs text-brand-muted">Commandes</p>
            </div>
          </div>
        </motion.div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Link href="/booking" className="card card-hover flex items-center gap-3 group">
            <div className="w-10 h-10 bg-brand-gold/10 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-brand-gold" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-brand-beige group-hover:text-brand-gold transition-colors">Prendre un rendez-vous</p>
              <p className="text-xs text-brand-muted">Réservez avec votre styliste</p>
            </div>
            <ChevronRight className="w-4 h-4 text-brand-muted group-hover:text-brand-gold transition-colors" />
          </Link>
          <Link href="/shop" className="card card-hover flex items-center gap-3 group">
            <div className="w-10 h-10 bg-brand-gold/10 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-brand-gold" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-brand-beige group-hover:text-brand-gold transition-colors">Boutique</p>
              <p className="text-xs text-brand-muted">Produits capillaires</p>
            </div>
            <ChevronRight className="w-4 h-4 text-brand-muted group-hover:text-brand-gold transition-colors" />
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-brand-charcoal rounded-xl p-1 mb-6 w-fit">
          {(["appointments", "orders"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t ? "bg-brand-gold text-brand-black" : "text-brand-muted hover:text-brand-beige"
              }`}
            >
              {t === "appointments" ? <><Calendar className="w-4 h-4" />Rendez-vous</> : <><ShoppingBag className="w-4 h-4" />Commandes</>}
            </button>
          ))}
        </div>

        {/* Appointments tab */}
        {tab === "appointments" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {upcoming.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-gold" />À venir ({upcoming.length})
                </h2>
                <div className="space-y-3">{upcoming.map((a) => <ApptCard key={a.id} a={a} />)}</div>
              </section>
            )}
            {past.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-widest mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-muted" />Historique
                </h2>
                <div className="space-y-3">{past.map((a) => <ApptCard key={a.id} a={a} />)}</div>
              </section>
            )}
            {appointments.length === 0 && (
              <Empty icon={<Calendar className="w-8 h-8 text-brand-muted" />}
                title="Aucun rendez-vous"
                description="Réservez votre première séance avec nos stylistes."
                action={{ href: "/booking", label: "Prendre un rendez-vous" }} />
            )}
          </motion.div>
        )}

        {/* Orders tab */}
        {tab === "orders" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {orders.length === 0
              ? <Empty icon={<ShoppingBag className="w-8 h-8 text-brand-muted" />}
                  title="Aucune commande"
                  description="Explorez notre boutique de produits capillaires."
                  action={{ href: "/shop", label: "Voir la boutique" }} />
              : orders.map((o) => <OrderCard key={o.id} order={o} />)
            }
          </motion.div>
        )}
      </div>
    </div>
  );
}

function ApptCard({ a }: { a: Appointment }) {
  const s = APPT_STATUS[a.status];
  const date = new Date(a.scheduledAt);
  return (
    <div className={`card flex flex-col sm:flex-row sm:items-center gap-4 ${date < new Date() && !["PENDING","CONFIRMED","ACCEPTED"].includes(a.status) ? "opacity-70" : ""}`}>
      <div className="w-12 h-12 bg-brand-gold/10 rounded-xl flex flex-col items-center justify-center text-brand-gold shrink-0">
        <span className="text-xs font-bold leading-none">{date.toLocaleDateString("fr-CA",{month:"short"}).toUpperCase()}</span>
        <span className="font-display text-lg font-bold leading-none">{date.getDate()}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <p className="font-medium text-brand-beige">{a.service.name}</p>
          <Badge {...s} />
        </div>
        <p className="text-sm text-brand-muted">
          avec {a.stylist.user.name ?? "Styliste"} · {date.toLocaleTimeString("fr-CA",{hour:"2-digit",minute:"2-digit"})}
        </p>
        {a.notes && <p className="text-xs text-brand-muted mt-1 italic truncate">Note : {a.notes}</p>}
      </div>
      <div className="text-right shrink-0">
        <p className="font-semibold text-brand-beige">{formatPrice(a.totalPrice)}</p>
        <p className="text-xs text-brand-muted">Dépôt : {formatPrice(a.depositAmount)}</p>
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
            <p className="font-medium text-brand-beige">Commande #{order.id.slice(-8).toUpperCase()}</p>
            <Badge {...s} />
          </div>
          <p className="text-xs text-brand-muted mt-0.5">
            {new Date(order.createdAt).toLocaleDateString("fr-CA",{year:"numeric",month:"long",day:"numeric"})}
            {" · "}{order.items.length} article{order.items.length > 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <p className="font-semibold text-brand-gold">{formatPrice(order.total)}</p>
          <button onClick={() => setOpen((o) => !o)} className="text-xs text-brand-muted hover:text-brand-gold transition-colors underline">
            {open ? "Masquer" : "Détails"}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-brand-charcoal pt-3 space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-charcoal overflow-hidden relative shrink-0">
                {item.product.images[0]
                  ? <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                  : <div className="w-full h-full flex items-center justify-center"><Package className="w-4 h-4 text-brand-muted" /></div>}
              </div>
              <Link href={`/shop/${item.product.slug}`} className="flex-1 text-sm text-brand-beige hover:text-brand-gold transition-colors truncate">
                {item.product.name}
              </Link>
              <span className="text-xs text-brand-muted shrink-0">{item.quantity} × {formatPrice(item.unitPrice)}</span>
            </div>
          ))}
          <div className="border-t border-brand-charcoal pt-2 space-y-1 text-xs text-brand-muted">
            <div className="flex justify-between"><span>Sous-total</span><span>{formatPrice(order.subtotal)}</span></div>
            <div className="flex justify-between"><span>TPS+TVQ</span><span>{formatPrice(order.tax)}</span></div>
            <div className="flex justify-between"><span>Livraison</span><span>{order.shipping === 0 ? "Gratuite" : formatPrice(order.shipping)}</span></div>
            <div className="flex justify-between font-semibold text-brand-beige text-sm pt-1">
              <span>Total</span><span className="text-brand-gold">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Empty({ icon, title, description, action }: {
  icon: React.ReactNode; title: string; description: string; action: { href: string; label: string };
}) {
  return (
    <div className="card text-center py-12 space-y-4">
      <div className="w-14 h-14 bg-brand-charcoal rounded-full flex items-center justify-center mx-auto">{icon}</div>
      <div>
        <p className="font-medium text-brand-beige">{title}</p>
        <p className="text-sm text-brand-muted mt-1">{description}</p>
      </div>
      <Link href={action.href} className="btn-primary inline-block">{action.label}</Link>
    </div>
  );
}
