import { redirect } from "next/navigation";
import { auth } from "@/auth";

/** Get the current session user or redirect to login. */
export async function requireUser(callbackUrl = "/") {
  const session = await auth();
  if (!session?.user) {
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }
  return session.user;
}

/** Require an ADMIN user; redirect otherwise. */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/admin");
  if (session.user.role !== "ADMIN") redirect("/");
  return session.user;
}
