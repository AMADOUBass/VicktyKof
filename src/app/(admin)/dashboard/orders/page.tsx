import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import type { Metadata } from "next";
import { AdminOrdersClient } from "@/components/admin/AdminOrdersClient";

export const metadata: Metadata = { title: "Commandes | Dashboard VicktyKof" };

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const { status, page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? "1", 10));
  const perPage = 20;
  const skip = (page - 1) * perPage;

  const where = status && status !== "all"
    ? { status: status as never }
    : {};

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: perPage,
      include: {
        user: { select: { name: true, email: true } },
        items: {
          include: { product: { select: { name: true, images: true } } },
        },
      },
    }),
    prisma.order.count({ where }),
  ]);

  const totalPages = Math.ceil(total / perPage);
  const stats = await prisma.order.groupBy({
    by: ["status"],
    _count: { _all: true },
  });

  return (
    <AdminOrdersClient
      orders={orders.map((o) => ({
        ...o,
        subtotal: parseFloat(o.subtotal.toString()),
        tax: parseFloat(o.tax.toString()),
        shipping: parseFloat(o.shipping.toString()),
        total: parseFloat(o.total.toString()),
        items: o.items.map((i) => ({
          ...i,
          unitPrice: parseFloat(i.unitPrice.toString()),
          total: parseFloat(i.total.toString()),
        })),
      }))}
      total={total}
      page={page}
      totalPages={totalPages}
      currentStatus={status ?? "all"}
      stats={stats}
      formatPrice={formatPrice}
    />
  );
}
