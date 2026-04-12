import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// DELETE /api/account — request account deletion (soft: deactivate + anonymize)
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({})) as { confirmation?: string };
  if (body.confirmation !== "DELETE") {
    return NextResponse.json({ error: "Confirmez la suppression en envoyant { confirmation: 'DELETE' }" }, { status: 400 });
  }

  // Cancel all pending appointments
  await prisma.appointment.updateMany({
    where: {
      clientId: session.user.id,
      status: { in: ["PENDING", "CONFIRMED", "ACCEPTED"] },
    },
    data: {
      status: "CANCELLED",
      cancelReason: "Suppression du compte",
    },
  });

  // Anonymize user data (GDPR / Loi 25 compliant)
  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: "Utilisateur supprimé",
      email: `deleted-${session.user.id}@vicktykof.com`,
      phone: null,
      image: null,
      passwordHash: null,
      isMember: false,
      loyaltyPoints: 0,
    },
  });

  // Delete all sessions to force logout
  await prisma.session.deleteMany({
    where: { userId: session.user.id },
  });

  // Delete all accounts (OAuth)
  await prisma.account.deleteMany({
    where: { userId: session.user.id },
  });

  return NextResponse.json({ success: true, message: "Compte supprimé. Vous allez être déconnecté." });
}
