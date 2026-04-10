import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function PostLoginPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const role = session.user.role;

  if (role === "ADMIN") redirect("/dashboard");
  if (role === "STYLIST") redirect("/portal");
  redirect("/account");
}
