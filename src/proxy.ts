import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Edge-safe proxy (Next.js 16 middleware convention): uses only the
// shared config (no Prisma/bcrypt) so it can run on the edge runtime.
const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  matcher: [
    "/admin/:path*",
    "/checkout/:path*",
    "/profile/:path*",
    "/addresses/:path*",
    "/security/:path*",
    "/orders/:path*",
  ],
};
