import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

const ADMIN_ROUTES = ["/dashboard"];
const STYLIST_ROUTES = ["/portal"];
const AUTH_REQUIRED = ["/booking", "/account"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  const needsAuth = AUTH_REQUIRED.some((r) => pathname.startsWith(r));
  if (needsAuth && !session) {
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, req.url)
    );
  }

  if (ADMIN_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  if (STYLIST_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!session || !["STYLIST", "ADMIN"].includes(session.user?.role ?? "")) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)).*)",
  ],
};
