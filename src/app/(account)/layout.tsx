import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AccountSidebar } from "@/components/layout/account-sidebar";
import { requireUser } from "@/lib/session";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser("/profile");

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <h1 className="mb-6 text-2xl font-extrabold tracking-tight">Akun Saya</h1>
        <div className="grid gap-6 md:grid-cols-[240px_1fr]">
          <aside className="md:sticky md:top-20 md:self-start">
            <AccountSidebar />
          </aside>
          <div className="min-w-0">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}
