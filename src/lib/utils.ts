import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number | string, currency = "CAD") {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency,
  }).format(num);
}

export function formatDate(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "d MMMM yyyy", { locale: fr });
}

export function formatDateTime(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "d MMMM yyyy 'à' HH:mm", { locale: fr });
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function calculateDeposit(totalCents: number, depositPct: number) {
  return Math.round(totalCents * (depositPct / 100));
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
