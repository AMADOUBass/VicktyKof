import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PortalClient } from "@/components/portal/PortalClient";

export default async function PortalPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const defaultTab = tab === "portfolio" ? "portfolio" : "agenda";

  const session = await auth();
  if (!session) redirect("/login?callbackUrl=/portal");

  const stylist = await prisma.stylist.findUnique({
    where: { userId: session.user.id },
    include: {
      user: { select: { name: true, image: true, email: true } },
      availability: { orderBy: { dayOfWeek: "asc" } },
      appointments: {
        where: {
          status: { in: ["CONFIRMED", "ACCEPTED"] },
          scheduledAt: { gte: new Date() },
        },
        include: {
          client: { select: { name: true, email: true, phone: true, image: true } },
          service: { select: { name: true, durationMins: true } },
        },
        orderBy: { scheduledAt: "asc" },
        take: 20,
      },
      portfolio: { orderBy: { createdAt: "desc" }, take: 20 },
    },
  });

  if (!stylist) {
    // Admin without stylist profile — show basic view
    return (
      <div className="pt-8 text-center">
        <p className="text-brand-muted">Aucun profil styliste associé à ce compte.</p>
      </div>
    );
  }

  const [completedCount, thisMonthCount] = await Promise.all([
    prisma.appointment.count({ where: { stylistId: stylist.id, status: "COMPLETED" } }),
    prisma.appointment.count({
      where: {
        stylistId: stylist.id,
        status: "COMPLETED",
        scheduledAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
      },
    }),
  ]);

  const serialized = {
    stylist: {
      id: stylist.id,
      bio: stylist.bio,
      yearsExp: stylist.yearsExp,
      specialties: stylist.specialties,
      user: stylist.user,
      availability: stylist.availability,
      portfolio: stylist.portfolio.map((p) => ({ ...p, createdAt: p.createdAt.toISOString() })),
    },
    appointments: stylist.appointments.map((a) => ({
      id: a.id,
      status: a.status,
      scheduledAt: a.scheduledAt.toISOString(),
      durationMins: a.durationMins,
      totalPrice: parseFloat(a.totalPrice.toString()),
      notes: a.notes,
      client: a.client,
      service: a.service,
    })),
    stats: {
      completedTotal: completedCount,
      completedThisMonth: thisMonthCount,
      upcomingCount: stylist.appointments.length,
      portfolioCount: stylist.portfolio.length,
    },
  };

  return <PortalClient {...serialized} defaultTab={defaultTab} />;
}
