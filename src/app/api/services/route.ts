import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/services
export async function GET() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: [{ category: "asc" }, { basePrice: "asc" }],
  });

  return NextResponse.json(services);
}
