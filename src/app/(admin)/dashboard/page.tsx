import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Calendar, Users, DollarSign, Package, TrendingUp } from "lucide-react";
import { AdminAppointmentList } from "@/components/admin/AdminAppointmentList";

async function getStats() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalAppointments,
    pendingAppointments,
    monthlyRevenue,
    totalClients,
    lowStockProducts,
  ] = await Promise.all([
    prisma.appointment.count({ where: { status: { in: ["CONFIRMED", "ACCEPTED"] } } }),
    prisma.appointment.count({ where: { status: "CONFIRMED" } }),
    prisma.payment.aggregate({
      where: { status: "SUCCEEDED", createdAt: { gte: startOfMonth } },
      _sum: { amount: true },
    }),
    prisma.user.count({ where: { role: "CLIENT" } }),
    prisma.product.count({ where: { stock: { lte: 5 }, isActive: true } }),
  ]);

  return {
    totalAppointments,
    pendingAppointments,
    monthlyRevenue: parseFloat(monthlyRevenue._sum.amount?.toString() ?? "0"),
    totalClients,
    lowStockProducts,
  };
}

async function getUpcomingAppointments() {
  return prisma.appointment.findMany({
    where: { status: { in: ["CONFIRMED", "ACCEPTED"] }, scheduledAt: { gte: new Date() } },
    include: {
      client: { select: { name: true, email: true } },
      service: { select: { name: true } },
      stylist: { include: { user: { select: { name: true } } } },
    },
    orderBy: { scheduledAt: "asc" },
    take: 10,
  });
}

export default async function DashboardPage() {
  const [stats, rawAppointments] = await Promise.all([getStats(), getUpcomingAppointments()]);

  // Serialize Decimal fields so AdminAppointmentList (client component) can receive them
  const appointments = rawAppointments.map((a) => ({
    ...a,
    totalPrice: parseFloat(a.totalPrice.toString()),
    depositAmount: parseFloat(a.depositAmount.toString()),
  }));

  const statCards = [
    {
      title: "Rendez-vous actifs",
      value: stats.totalAppointments.toString(),
      sub: `${stats.pendingAppointments} en attente`,
      icon: Calendar,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      title: "Revenus du mois",
      value: formatPrice(stats.monthlyRevenue),
      sub: "Dépôts encaissés",
      icon: DollarSign,
      color: "text-brand-gold",
      bg: "bg-brand-gold/10",
    },
    {
      title: "Clientes",
      value: stats.totalClients.toString(),
      sub: "Comptes actifs",
      icon: Users,
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
    {
      title: "Stock faible",
      value: stats.lowStockProducts.toString(),
      sub: "Produits à réapprovisionner",
      icon: Package,
      color: "text-red-400",
      bg: "bg-red-400/10",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-brand-beige">Tableau de bord</h1>
        <p className="text-brand-muted mt-1">Bienvenue, Vicky. Voici un aperçu de votre salon.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-brand-muted">{stat.title}</p>
                  <p className="font-display text-2xl font-bold text-brand-beige mt-1">{stat.value}</p>
                  <p className="text-xs text-brand-muted mt-1">{stat.sub}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upcoming appointments */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-brand-beige flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-gold" />
            Prochains rendez-vous
          </h2>
        </div>
        <AdminAppointmentList appointments={appointments} />
      </div>
    </div>
  );
}
