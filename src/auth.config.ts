import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

/**
 * Edge-safe config (no Prisma / bcrypt). Used by middleware and shared
 * with the full Node config in `auth.ts`.
 */
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user.role ?? "CUSTOMER") as "CUSTOMER" | "ADMIN";
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "CUSTOMER" | "ADMIN";
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = auth?.user?.role;
      const path = nextUrl.pathname;

      // Admin area: must be ADMIN
      if (path.startsWith("/admin")) {
        return isLoggedIn && role === "ADMIN";
      }

      // Customer-protected areas
      const protectedPrefixes = ["/checkout", "/profile", "/addresses", "/security", "/orders"];
      if (protectedPrefixes.some((p) => path.startsWith(p))) {
        return isLoggedIn;
      }

      return true;
    },
  },
  session: { strategy: "jwt" },
} satisfies NextAuthConfig;
