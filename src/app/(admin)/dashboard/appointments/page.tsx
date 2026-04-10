"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Search,
  CheckCircle,
  XCircle,
  RefreshCw,
  Filter,
} from "lucide-react";
import { formatPrice, formatDateTime } from "@/lib/utils";
import toast from "react-hot-toast";

type AppointmentStatus =
  | "PENDING" | "CONFIRMED" | "ACCEPTED" | "DECLINED" | "COMPLETED" | "CANCELLED" | "RESCHEDULED";

interface Appointment {
  id: string;
  status: AppointmentStatus;
  scheduledAt: string;
  totalPrice: number;
  depositAmount: number;
  notes: string | null;
  adminNotes: string | null;
  client: { name: string | null; email: string | null };
  service: { name: string };
  stylist: { user: { name: string | null } };
}

const STATUS_STYLES: Record<AppointmentStatus, string> = {
  PENDING: "text-yellow-400 bg-yellow-400/10",
  CONFIRMED: "text-blue-400 bg-blue-400/10",
  ACCEPTED: "text-green-400 bg-green-400/10",
  DECLINED: "text-red-400 bg-red-400/10",
  COMPLETED: "text-brand-gold bg-brand-gold/10",
  CANCELLED: "text-brand-muted bg-brand-muted/10",
  RESCHEDULED: "text-purple-400 bg-purple-400/10",
};

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmé",
  ACCEPTED: "Accepté",
  DECLINED: "Refusé",
  COMPLETED: "Terminé",
  CANCELLED: "Annulé",
  RESCHEDULED: "Reprogrammé",
};

const ALL_STATUSES = Object.keys(STATUS_LABELS) as AppointmentStatus[];

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "ALL">("ALL");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/appointments");
      const data = await res.json() as { appointments?: Appointment[] };
      setAppointments(data.appointments ?? []);
    } catch {
      toast.error("Impossible de charger les rendez-vous");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchAppointments();
  }, [fetchAppointments]);

  async function updateStatus(id: string, status: AppointmentStatus) {
    setActionLoading(id + status);
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      );
      toast.success(`Statut mis à jour : ${STATUS_LABELS[status]}`);
    } catch {
      toast.error("Échec de la mise à jour");
    } finally {
      setActionLoading(null);
    }
  }

  const filtered = appointments.filter((a) => {
    const matchStatus = statusFilter === "ALL" || a.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      a.client.name?.toLowerCase().includes(q) ||
      a.client.email?.toLowerCase().includes(q) ||
      a.service.name.toLowerCase().includes(q) ||
      a.stylist.user.name?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const counts = ALL_STATUSES.reduce(
    (acc, s) => ({ ...acc, [s]: appointments.filter((a) => a.status === s).length }),
    {} as Record<AppointmentStatus, number>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-brand-beige">Rendez-vous</h1>
          <p className="text-brand-muted mt-1">{appointments.length} rendez-vous au total</p>
        </div>
        <button
          onClick={fetchAppointments}
          className="btn-outline flex items-center gap-2 text-sm"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Actualiser
        </button>
      </div>

      {/* Status summary pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter("ALL")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            statusFilter === "ALL"
              ? "bg-brand-gold text-brand-black"
              : "bg-brand-charcoal text-brand-muted hover:text-brand-beige"
          }`}
        >
          Tous ({appointments.length})
        </button>
        {ALL_STATUSES.map((s) => (
          counts[s] > 0 && (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                statusFilter === s
                  ? "bg-brand-gold text-brand-black"
                  : `${STATUS_STYLES[s]} hover:opacity-80`
              }`}
            >
              {STATUS_LABELS[s]} ({counts[s]})
            </button>
          )
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
        <input
          type="text"
          placeholder="Rechercher par client, service, styliste..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-10 w-full max-w-md"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="card space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-brand-charcoal rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-12">
          <Calendar className="w-10 h-10 text-brand-muted mx-auto mb-3" />
          <p className="text-brand-muted">Aucun rendez-vous trouvé</p>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto -mx-0">
            <table className="w-full min-w-[640px]">
              <thead className="border-b border-brand-charcoal">
                <tr className="text-left text-xs text-brand-muted uppercase tracking-wider">
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3 hidden sm:table-cell">Styliste</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Montant</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-charcoal">
                {filtered.map((appt) => (
                  <motion.tr
                    key={appt.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-brand-charcoal/40 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-brand-beige">{appt.client.name ?? "—"}</p>
                      <p className="text-xs text-brand-muted">{appt.client.email}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-brand-beige">{appt.service.name}</td>
                    <td className="px-4 py-3 text-sm text-brand-beige hidden sm:table-cell">{appt.stylist.user.name ?? "—"}</td>
                    <td className="px-4 py-3 text-sm text-brand-muted whitespace-nowrap">
                      {new Date(appt.scheduledAt).toLocaleDateString("fr-CA", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                      <br />
                      <span className="text-xs">
                        {new Date(appt.scheduledAt).toLocaleTimeString("fr-CA", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-brand-beige">{formatPrice(appt.totalPrice)}</p>
                      <p className="text-xs text-brand-muted">Dépôt : {formatPrice(appt.depositAmount)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[appt.status]}`}>
                        {STATUS_LABELS[appt.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {appt.status === "CONFIRMED" && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => updateStatus(appt.id, "ACCEPTED")}
                            disabled={actionLoading !== null}
                            className="p-1.5 rounded-lg bg-green-400/10 text-green-400 hover:bg-green-400/20 transition-colors disabled:opacity-50"
                            title="Accepter"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => updateStatus(appt.id, "DECLINED")}
                            disabled={actionLoading !== null}
                            className="p-1.5 rounded-lg bg-red-400/10 text-red-400 hover:bg-red-400/20 transition-colors disabled:opacity-50"
                            title="Refuser"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      {appt.status === "ACCEPTED" && (
                        <button
                          onClick={() => updateStatus(appt.id, "COMPLETED")}
                          disabled={actionLoading !== null}
                          className="px-2 py-1 rounded-lg bg-brand-gold/10 text-brand-gold text-xs hover:bg-brand-gold/20 transition-colors disabled:opacity-50"
                        >
                          Terminé
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
