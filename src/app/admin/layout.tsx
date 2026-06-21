import type { Metadata } from "next";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { AdminMobileNav } from "@/components/layout/admin-mobile-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "Admin · O'K Kitchen" };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <div className="flex min-h-screen bg-secondary/30">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 border-r bg-card md:block">
        <AdminSidebar />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-2 border-b bg-card/80 px-4 backdrop-blur">
          <div className="flex items-center gap-2">
            <AdminMobileNav />
            <span className="text-sm text-muted-foreground">
              Halo, <span className="font-semibold text-foreground">{admin.name}</span>
            </span>
          </div>
          <ThemeToggle />
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
