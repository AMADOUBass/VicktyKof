import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/stylists?serviceId=...
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const serviceId = searchParams.get("serviceId");

  const stylists = await prisma.stylist.findMany({
    where: {
      isActive: true,
      ...(serviceId
        ? { services: { some: { serviceId } } }
        : {}),
    },
    include: {
      user: { select: { name: true, email: true, image: true } },
      availability: { orderBy: { dayOfWeek: "asc" } },
      portfolio: { take: 3, orderBy: { createdAt: "desc" } },
      _count: { select: { appointments: true } },
    },
    orderBy: { yearsExp: "desc" },
  });

  return NextResponse.json(stylists);
}
