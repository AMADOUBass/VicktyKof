import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

const ADMIN_ROUTES = ["/dashboard"];
const STYLIST_ROUTES = ["/portal"];
const AUTH_REQUIRED = ["/booking", "/account"];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });

  const needsAuth = AUTH_REQUIRED.some((r) => pathname.startsWith(r));
  if (needsAuth && !token) {
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, req.url)
    );
  }

  if (ADMIN_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!token || token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  if (STYLIST_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!token || !["STYLIST", "ADMIN"].includes(token.role as string)) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)).*)",
  ],
};
