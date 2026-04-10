import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const ADMIN_ROUTES = ["/dashboard"];
const STYLIST_ROUTES = ["/portal"];
// /shop/cart is semi-public (viewing ok, checkout requires auth — handled client-side)
const AUTH_REQUIRED = ["/booking", "/account"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Redirect unauthenticated users from protected routes
  const needsAuth = AUTH_REQUIRED.some((r) => pathname.startsWith(r));
  if (needsAuth && !session) {
    return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, req.url));
  }

  // Admin-only routes
  if (ADMIN_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Stylist-only routes
  if (STYLIST_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!session || !["STYLIST", "ADMIN"].includes(session.user.role)) {
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
