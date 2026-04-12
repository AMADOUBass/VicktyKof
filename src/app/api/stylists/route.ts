import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const stylistCreateSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8).optional(),
  bio: z.string().optional(),
  yearsExp: z.number().default(0),
  specialties: z.array(z.string()).default([]),
});

// GET /api/stylists
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
      user: { select: { id: true, name: true, email: true, image: true } },
      availability: { orderBy: { dayOfWeek: "asc" } },
      portfolio: { take: 3, orderBy: { createdAt: "desc" } },
      _count: { select: { appointments: true } },
    },
    orderBy: { yearsExp: "desc" },
  });

  return NextResponse.json(stylists);
}

// POST /api/stylists
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as unknown;
    const parsed = stylistCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides", details: parsed.error.flatten() }, { status: 400 });
    }

    const { name, email, password, bio, yearsExp, specialties } = parsed.data;

    // Check if user exists
    let user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      // If user exists, check if they are already a stylist
      const existingStylist = await prisma.stylist.findUnique({ where: { userId: user.id } });
      if (existingStylist) {
        return NextResponse.json({ error: "Ce styliste existe déjà" }, { status: 409 });
      }

      // Promote to STYLIST if they weren't
      if (user.role === "CLIENT") {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { role: "STYLIST" },
        });
      }
    } else {
      // Create new user
      if (!password) {
        return NextResponse.json({ error: "Mot de passe requis pour un nouveau compte" }, { status: 400 });
      }
      const passwordHash = await bcrypt.hash(password, 12);
      user = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          role: "STYLIST",
        },
      });
    }

    // Create Stylist record
    const stylist = await prisma.stylist.create({
      data: {
        userId: user.id,
        bio,
        yearsExp,
        specialties: specialties as any, // Specialty enum cast
        isActive: true,
      },
      include: {
        user: { select: { name: true, email: true, image: true } },
      },
    });

    return NextResponse.json(stylist, { status: 201 });
  } catch (err) {
    console.error("[STYLIST_POST]", err);
    return NextResponse.json({ error: "Erreur lors de la création du styliste" }, { status: 500 });
  }
}
