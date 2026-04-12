"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Package, ChevronLeft, ChevronRight, ShoppingBag, Filter, RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";

type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";

interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  total: number;
  product: { name: string; images: string[] };
}

interface Order {
  id: string;
  status: OrderStatus;
  paymentMethod: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  createdAt: Date;
  trackingNumber: string | null;
  user: { name: string | null; email: string };
  items: OrderItem[];
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string }> = {
  PENDING:    { label: "En attente",    color: "text-yellow-400 bg-yellow-400/10" },
  PROCESSING: { label: "En traitement", color: "text-blue-400 bg-blue-400/10" },
  SHIPPED:    { label: "Expédié",       color: "text-purple-400 bg-purple-400/10" },
  DELIVERED:  { label: "Livré",         color: "text-green-400 bg-green-400/10" },
  CANCELLED:  { label: "Annulé",        color: "text-red-400 bg-red-400/10" },
  REFUNDED:   { label: "Remboursé",     color: "text-brand-muted bg-brand-muted/10" },
};

const ALL_STATUSES: OrderStatus[] = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];

interface Props {
  orders: Order[];
  total: number;
  page: number;
  totalPages: number;
  currentStatus: string;
  stats: { status: string; _count: { _all: number } }[];
  formatPrice: (v: number) => string;
}

export function AdminOrdersClient({ orders, total, page, totalPages, currentStatus, stats, formatPrice }: Props) {
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const statMap = Object.fromEntries(stats.map((s) => [s.status, s._count._all]));

  async function handleStatusChange(orderId: string, status: OrderStatus, trackingNumber?: string) {
    setUpdating(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, trackingNumber }),
      });
      if (!res.ok) throw new Error();
      toast.success("Statut mis à jour");
      router.refresh();
    } catch {
      toast.error("Erreur de mise à jour");
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-beige flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-brand-gold" /> Commandes
          </h1>
          <p className="text-brand-muted text-sm mt-1">{total} commande{total > 1 ? "s" : ""} au total</p>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {[{ key: "all", label: "Toutes", count: total }, ...ALL_STATUSES.map((s) => ({ key: s, label: STATUS_CONFIG[s].label, count: statMap[s] ?? 0 }))].map((f) => (
          <Link
            key={f.key}
            href={`/dashboard/orders?status=${f.key}`}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              currentStatus === f.key ? "bg-brand-gold text-brand-black" : "bg-brand-charcoal text-brand-muted hover:text-brand-beige"
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            {f.label}
            {f.count > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${currentStatus === f.key ? "bg-brand-black/20" : "bg-white/10"}`}>
                {f.count}
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* Orders list */}
      {orders.length === 0 ? (
        <div className="card text-center py-16">
          <Package className="w-12 h-12 text-brand-muted mx-auto mb-3" />
          <p className="text-brand-muted">Aucune commande trouvée.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const s = STATUS_CONFIG[order.status];
            const isExpanded = expanded === order.id;
            return (
              <div key={order.id} className="card">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="font-medium text-brand-beige text-sm">#{order.id.slice(-8).toUpperCase()}</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${s.color}`}>{s.label}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] uppercase font-bold border ${
                        order.paymentMethod === "INTERAC" ? "text-brand-gold border-brand-gold/30" : "text-brand-muted border-white/10"
                      }`}>
                        {order.paymentMethod === "INTERAC" ? "Interac" : "Stripe"}
                      </span>
                    </div>
                    <p className="text-xs text-brand-muted">
                      {order.user.name ?? order.user.email} ·{" "}
                      {new Date(order.createdAt).toLocaleDateString("fr-CA", { day: "numeric", month: "long", year: "numeric" })} ·{" "}
                      {order.items.length} article{order.items.length > 1 ? "s" : ""}
                    </p>
                    {order.trackingNumber && (
                      <p className="text-xs text-brand-gold mt-1">📦 Suivi : {order.trackingNumber}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <p className="font-semibold text-brand-gold">{formatPrice(order.total)}</p>
                    {order.status === "PENDING" && order.paymentMethod === "INTERAC" && (
                      <button
                        onClick={() => handleStatusChange(order.id, "PROCESSING")}
                        disabled={updating === order.id}
                        className="px-2 py-1.5 rounded-lg bg-brand-gold/10 text-brand-gold text-[10px] sm:text-xs hover:bg-brand-gold/20 transition-colors disabled:opacity-50 whitespace-nowrap uppercase font-bold"
                      >
                        Confirmer Interac
                      </button>
                    )}
                    <select
                      value={order.status}
                      disabled={updating === order.id}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className="input text-xs py-1.5 pr-8 w-40 disabled:opacity-50"
                    >
                      {ALL_STATUSES.map((st) => (
                        <option key={st} value={st}>{STATUS_CONFIG[st].label}</option>
                      ))}
                    </select>
                    {updating === order.id && <RefreshCw className="w-4 h-4 text-brand-gold animate-spin" />}
                    <button
                      onClick={() => setExpanded(isExpanded ? null : order.id)}
                      className="text-xs text-brand-muted hover:text-brand-gold underline transition-colors"
                    >
                      {isExpanded ? "Masquer" : "Détails"}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-brand-charcoal space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-brand-charcoal overflow-hidden relative shrink-0">
                          {item.product.images[0] ? (
                            <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                          ) : (
                            <Package className="w-4 h-4 text-brand-muted m-auto" />
                          )}
                        </div>
                        <span className="flex-1 text-sm text-brand-beige">{item.product.name}</span>
                        <span className="text-xs text-brand-muted">{item.quantity} × {formatPrice(item.unitPrice)}</span>
                      </div>
                    ))}
                    <div className="text-xs text-brand-muted space-y-1 pt-2 border-t border-brand-charcoal">
                      <div className="flex justify-between"><span>Sous-total</span><span>{formatPrice(order.subtotal)}</span></div>
                      <div className="flex justify-between"><span>Taxes</span><span>{formatPrice(order.tax)}</span></div>
                      <div className="flex justify-between"><span>Livraison</span><span>{order.shipping === 0 ? "Gratuite" : formatPrice(order.shipping)}</span></div>
                      <div className="flex justify-between font-semibold text-brand-beige text-sm pt-1">
                        <span>Total</span><span className="text-brand-gold">{formatPrice(order.total)}</span>
                      </div>
                    </div>
                    {/* Tracking number input */}
                    {(order.status === "SHIPPED" || order.status === "PROCESSING") && (
                      <TrackingInput orderId={order.id} current={order.trackingNumber} onSave={(id, tn) => handleStatusChange(id, order.status, tn)} />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <Link
            href={`/dashboard/orders?status=${currentStatus}&page=${page - 1}`}
            className={`p-2 rounded-lg transition-colors ${page <= 1 ? "opacity-30 pointer-events-none" : "hover:bg-brand-charcoal"}`}
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <span className="text-sm text-brand-muted">Page {page} / {totalPages}</span>
          <Link
            href={`/dashboard/orders?status=${currentStatus}&page=${page + 1}`}
            className={`p-2 rounded-lg transition-colors ${page >= totalPages ? "opacity-30 pointer-events-none" : "hover:bg-brand-charcoal"}`}
          >
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      )}
    </div>
  );
}

function TrackingInput({ orderId, current, onSave }: { orderId: string; current: string | null; onSave: (id: string, tn: string) => void }) {
  const [val, setVal] = useState(current ?? "");
  return (
    <div className="flex gap-2 mt-2">
      <input
        className="input text-xs flex-1"
        placeholder="Numéro de suivi (optionnel)"
        value={val}
        onChange={(e) => setVal(e.target.value)}
      />
      <button onClick={() => onSave(orderId, val)} className="btn-primary text-xs px-4">
        Enregistrer
      </button>
    </div>
  );
}
