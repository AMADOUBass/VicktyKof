import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  phone: z.string().max(20).optional().nullable(),
  image: z.string().url().optional().nullable(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8).optional(),
});

// PATCH /api/users/[id] — update own profile
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { id } = await params;

  // Users can only update their own profile (admins can update anyone)
  if (session.user.id !== id && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json() as unknown;
  const parsed = updateProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides", details: parsed.error.flatten() }, { status: 400 });
  }

  const { name, phone, image, currentPassword, newPassword } = parsed.data;

  // If changing password, verify current password first
  if (newPassword) {
    if (!currentPassword) {
      return NextResponse.json({ error: "Le mot de passe actuel est requis" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id }, select: { passwordHash: true } });
    if (!user?.passwordHash) {
      return NextResponse.json({ error: "Compte OAuth — pas de mot de passe à changer" }, { status: 400 });
    }

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Mot de passe actuel incorrect" }, { status: 400 });
    }
  }

  // Build update data
  const updateData: Record<string, unknown> = {};
  if (name !== undefined) updateData.name = name;
  if (phone !== undefined) updateData.phone = phone;
  if (image !== undefined) updateData.image = image;
  if (newPassword) {
    updateData.passwordHash = await bcrypt.hash(newPassword, 12);
  }

  const updated = await prisma.user.update({
    where: { id },
    data: updateData,
    select: { id: true, name: true, phone: true, email: true, image: true },
  });

  return NextResponse.json(updated);
}
