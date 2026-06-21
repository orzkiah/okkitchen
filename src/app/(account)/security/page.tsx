import type { Metadata } from "next";
import { ChangePasswordForm } from "@/features/auth/components/change-password-form";

export const metadata: Metadata = { title: "Keamanan" };

export default function SecurityPage() {
  return <ChangePasswordForm />;
}
