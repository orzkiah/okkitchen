import { handlers } from "@/auth";

// Never cache auth responses — sessions must be per-request, per-user.
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export const { GET, POST } = handlers;
