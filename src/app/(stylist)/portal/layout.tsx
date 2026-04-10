import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { Calendar, ImageIcon, LayoutDashboard, LogOut } from "lucide-react";
import { signOut } from "@/lib/auth";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || !["STYLIST", "ADMIN"].includes(session.user.role)) {
    redirect("/login?callbackUrl=/portal");
  }

  return (
    <div className="min-h-screen bg-brand-black">
      {/* Top nav */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-brand-charcoal border-b border-brand-charcoal/80 h-14 sm:h-16 flex items-center px-4 sm:px-6 gap-3">
        <Link href="/" className="font-display text-base sm:text-lg font-bold text-brand-gold mr-2 sm:mr-4 shrink-0">VicktyKof</Link>
        <span className="text-brand-muted text-xs sm:text-sm hidden xs:block">Portail styliste</span>
        <nav className="flex items-center gap-0.5 sm:gap-1 ml-auto">
          {[
            { href: "/portal", label: "Aperçu", icon: LayoutDashboard },
            { href: "/portal?tab=agenda", label: "Agenda", icon: Calendar },
            { href: "/portal?tab=portfolio", label: "Portfolio", icon: ImageIcon },
          ].map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-1.5 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm text-brand-muted hover:text-brand-beige hover:bg-brand-black/50 transition-colors"
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
          <form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}>
            <button type="submit" className="flex items-center gap-1.5 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm text-red-400 hover:bg-red-400/10 transition-colors ml-1 sm:ml-2">
              <LogOut className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </form>
        </nav>
      </header>
      <main className="pt-14 sm:pt-16 px-4 sm:px-6 pb-6 max-w-5xl mx-auto">{children}</main>
    </div>
  );
}
