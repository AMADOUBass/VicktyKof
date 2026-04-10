import { prisma } from "@/lib/prisma";
import { Crown, Users } from "lucide-react";
import Image from "next/image";

async function getUsers() {
  return prisma.user.findMany({
    where: { role: "CLIENT" },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      isMember: true,
      loyaltyPoints: true,
      createdAt: true,
      _count: {
        select: { appointments: true, orders: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

function getInitials(name: string | null) {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default async function AdminUsersPage() {
  const users = await getUsers();
  const memberCount = users.filter((u) => u.isMember).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-brand-beige">Clientes</h1>
          <p className="text-brand-muted mt-1">
            {users.length} comptes · {memberCount} membres
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-brand-muted bg-brand-charcoal rounded-xl px-3 py-2">
          <Crown className="w-4 h-4 text-brand-gold" />
          <span className="text-brand-beige font-medium">{memberCount}</span>
          <span>membres actifs</span>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="card text-center py-12">
          <Users className="w-10 h-10 text-brand-muted mx-auto mb-3" />
          <p className="text-brand-muted">Aucune cliente inscrite</p>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[540px]">
              <thead className="border-b border-brand-charcoal">
                <tr className="text-left text-xs text-brand-muted uppercase tracking-wider">
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3">RDV</th>
                  <th className="px-4 py-3 hidden sm:table-cell">Commandes</th>
                  <th className="px-4 py-3 hidden sm:table-cell">Points</th>
                  <th className="px-4 py-3 hidden md:table-cell">Membre depuis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-charcoal">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-brand-charcoal/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold font-bold text-sm shrink-0 overflow-hidden">
                          {user.image ? (
                            <Image src={user.image} alt={user.name ?? ""} width={36} height={36} className="rounded-full object-cover" />
                          ) : (
                            getInitials(user.name)
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-brand-beige">{user.name ?? "—"}</p>
                          <p className="text-xs text-brand-muted">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {user.isMember ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-brand-gold bg-brand-gold/10 px-2.5 py-0.5 rounded-full">
                          <Crown className="w-3 h-3" />
                          Membre
                        </span>
                      ) : (
                        <span className="text-xs text-brand-muted">Cliente</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-brand-beige">{user._count.appointments}</td>
                    <td className="px-4 py-3 text-sm text-brand-beige hidden sm:table-cell">{user._count.orders}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-sm font-medium text-brand-gold">{user.loyaltyPoints}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-brand-muted hidden md:table-cell">
                      {user.createdAt.toLocaleDateString("fr-CA", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
