import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AccountClient } from "@/components/account/AccountClient";

async function getUserData(userId: string) {
  const [appointments, orders] = await Promise.all([
    prisma.appointment.findMany({
      where: { clientId: userId },
      include: {
        service: { select: { name: true, imageUrl: true } },
        stylist: { include: { user: { select: { name: true, image: true } } } },
      },
      orderBy: { scheduledAt: "desc" },
    }),
    prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: { product: { select: { name: true, images: true, slug: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return { appointments, orders };
}

export default async function AccountPage() {
  const session = await auth();
  if (!session) redirect("/login?callbackUrl=/account");

  const { appointments, orders } = await getUserData(session.user.id);

  // Fetch missing info from DB since it's not all in the session
  const dbUser = await prisma.user.findUnique({ where: { id: session.user.id }, select: { phone: true, loyaltyPoints: true } });

  const serialized = {
    userId: session.user.id,
    user: {
      name: session.user.name ?? null,
      email: session.user.email ?? null,
      image: session.user.image ?? null,
      isMember: session.user.isMember,
      phone: dbUser?.phone ?? null,
      loyaltyPoints: dbUser?.loyaltyPoints ?? 0,
    },
    appointments: appointments.map((a) => ({
      id: a.id,
      status: a.status,
      scheduledAt: a.scheduledAt.toISOString(),
      durationMins: a.durationMins,
      totalPrice: parseFloat(a.totalPrice.toString()),
      depositAmount: parseFloat(a.depositAmount.toString()),
      notes: a.notes,
      service: a.service,
      stylist: { user: { name: a.stylist.user.name, image: a.stylist.user.image } },
    })),
    orders: orders.map((o) => ({
      id: o.id,
      status: o.status,
      total: parseFloat(o.total.toString()),
      subtotal: parseFloat(o.subtotal.toString()),
      tax: parseFloat(o.tax.toString()),
      shipping: parseFloat(o.shipping.toString()),
      createdAt: o.createdAt.toISOString(),
      items: o.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        unitPrice: parseFloat(item.unitPrice.toString()),
        product: item.product,
      })),
    })),
  };

  return <AccountClient {...serialized} />;
}
