import type { NextAuthConfig } from "next-auth";
import type { Role } from "@prisma/client";

// Edge-compatible config — NO Node.js modules (no bcrypt, no PrismaAdapter)
// Used by middleware to verify JWT without importing server-only code
export const authConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: { strategy: "jwt" as const },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as { id?: string }).id ?? "";
        token.role = (user as { role: Role }).role;
        token.isMember = (user as { isMember: boolean }).isMember;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.isMember = token.isMember as boolean;
      }
      return session;
    },
  },
  providers: [], // providers added in auth.ts only
} satisfies NextAuthConfig;
