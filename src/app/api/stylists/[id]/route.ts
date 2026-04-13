import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Specialty } from "@prisma/client";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const stylist = await prisma.stylist.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, image: true, email: true } },
      availability: { orderBy: { dayOfWeek: "asc" } },
      portfolio: { orderBy: { createdAt: "desc" } },
      services: { include: { service: true } },
    },
  });
  if (!stylist) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  return NextResponse.json(stylist);
}

const updateSchema = z.object({
  bio: z.string().optional(),
  yearsExp: z.number().int().min(0).optional(),
  specialties: z.array(z.string()).optional(),
  avatarUrl: z.string().url().optional(),
  isActive: z.boolean().optional(),
  availability: z.array(z.object({
    dayOfWeek: z.number().int().min(0).max(6),
    startTime: z.string(),
    endTime: z.string(),
  })).optional(),
});

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { id } = await params;
  const stylist = await prisma.stylist.findUnique({ where: { id } });
  if (!stylist) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  // Only the stylist themselves or admin can update
  const isOwner = stylist.userId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";
  if (!isOwner && !isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json() as unknown;
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Données invalides" }, { status: 400 });

  const { availability, ...stylistData } = parsed.data;

  const updated = await prisma.$transaction(async (tx) => {
    const s = await tx.stylist.update({
      where: { id },
      data: {
        ...stylistData,
        specialties: stylistData.specialties as Specialty[] | undefined,
      },
    });

    // Sync User image if avatarUrl is provided
    if (stylistData.avatarUrl) {
      await tx.user.update({
        where: { id: stylist.userId },
        data: { image: stylistData.avatarUrl },
      });
    }

    if (availability) {
      // Upsert all provided availability, deactivate the rest
      const providedDays = availability.map((a) => a.dayOfWeek);
      await tx.availability.deleteMany({ where: { stylistId: id } });
      for (const avail of availability) {
        await tx.availability.create({
          data: { stylistId: id, ...avail, isActive: true },
        });
      }
    }

    return s;
  });

  return NextResponse.json(updated);
}
