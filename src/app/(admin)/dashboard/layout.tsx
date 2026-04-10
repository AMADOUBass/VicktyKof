import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-brand-black">
      <AdminSidebar />
      {/* Desktop: offset by sidebar width. Mobile: offset by topbar height */}
      <main className="lg:ml-64 pt-14 lg:pt-0 p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
