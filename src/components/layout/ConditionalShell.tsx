"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

const SHELL_HIDDEN_PREFIXES = ["/dashboard", "/portal", "/post-login"];

export function ConditionalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideShell = SHELL_HIDDEN_PREFIXES.some((p) => pathname.startsWith(p));

  if (hideShell) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 pb-24 lg:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 -mb-20 relative z-20 pointer-events-none">
          <div className="pointer-events-auto">
            <Breadcrumbs />
          </div>
        </div>
        {children}
      </main>
      <MobileTabBar />
      <Footer />
    </>
  );
}
