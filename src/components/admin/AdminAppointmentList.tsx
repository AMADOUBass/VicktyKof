"use client";

import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Check, X, MoreHorizontal } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import type { AppointmentStatus } from "@prisma/client";

interface Appointment {
  id: string;
  scheduledAt: Date;
  status: AppointmentStatus;
  totalPrice: string | number;
  depositAmount: string | number;
  client: { name: string | null; email: string };
  service: { name: string };
  stylist: { user: { name: string | null } };
}

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  PENDING: "En attente de paiement",
  CONFIRMED: "Dépôt reçu",
  ACCEPTED: "Confirmé",
  DECLINED: "Refusé",
  COMPLETED: "Terminé",
  CANCELLED: "Annulé",
  RESCHEDULED: "Reprogrammé",
};

const STATUS_STYLES: Record<AppointmentStatus, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  CONFIRMED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  ACCEPTED: "bg-green-500/10 text-green-400 border-green-500/20",
  DECLINED: "bg-red-500/10 text-red-400 border-red-500/20",
  COMPLETED: "bg-brand-gold/10 text-brand-gold border-brand-gold/20",
  CANCELLED: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  RESCHEDULED: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

interface Props {
  appointments: Appointment[];
}

export function AdminAppointmentList({ appointments: initial }: Props) {
  const [appointments, setAppointments] = useState(initial);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const updateStatus = async (id: string, status: "ACCEPTED" | "DECLINED", reason?: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, adminNotes: reason }),
      });
      if (!res.ok) throw new Error("Erreur");

      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      );
      toast.success(status === "ACCEPTED" ? "Rendez-vous confirmé ✓" : "Rendez-vous refusé");
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setActionLoading(null);
    }
  };

  if (appointments.length === 0) {
    return (
      <p className="text-center text-brand-muted py-8">
        Aucun rendez-vous à venir.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/5 text-left">
            {["Cliente", "Service", "Styliste", "Date", "Montant", "Statut", "Actions"].map((h) => (
              <th key={h} className="pb-3 text-xs text-brand-muted font-medium uppercase tracking-wide pr-4">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {appointments.map((appt) => (
            <tr key={appt.id} className="hover:bg-white/2 transition-colors">
              <td className="py-4 pr-4">
                <p className="font-medium text-brand-beige">{appt.client.name ?? "—"}</p>
                <p className="text-xs text-brand-muted">{appt.client.email}</p>
              </td>
              <td className="py-4 pr-4 text-brand-muted">{appt.service.name}</td>
              <td className="py-4 pr-4 text-brand-muted">{appt.stylist.user.name ?? "—"}</td>
              <td className="py-4 pr-4 text-brand-muted whitespace-nowrap">
                {format(new Date(appt.scheduledAt), "d MMM yyyy, HH:mm", { locale: fr })}
              </td>
              <td className="py-4 pr-4">
                <p className="text-brand-beige">{formatPrice(parseFloat(appt.totalPrice.toString()))}</p>
                <p className="text-xs text-brand-gold">Dépôt: {formatPrice(parseFloat(appt.depositAmount.toString()))}</p>
              </td>
              <td className="py-4 pr-4">
                <span
                  className={cn(
                    "inline-flex px-2.5 py-1 rounded-full text-xs font-medium border",
                    STATUS_STYLES[appt.status]
                  )}
                >
                  {STATUS_LABELS[appt.status]}
                </span>
              </td>
              <td className="py-4">
                {appt.status === "CONFIRMED" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateStatus(appt.id, "ACCEPTED")}
                      disabled={actionLoading === appt.id}
                      className="w-8 h-8 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center justify-center text-green-400 hover:bg-green-500/20 transition-colors"
                      title="Confirmer"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => updateStatus(appt.id, "DECLINED")}
                      disabled={actionLoading === appt.id}
                      className="w-8 h-8 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors"
                      title="Refuser"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {appt.status !== "CONFIRMED" && (
                  <button className="btn-ghost p-2">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
