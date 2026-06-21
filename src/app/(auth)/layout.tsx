import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { ChefHat, Leaf, ShieldCheck, Truck } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden brand-gradient p-10 text-white lg:flex">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -left-10 top-10 h-64 w-64 rounded-full bg-white/30 blur-3xl" />
          <div className="absolute bottom-10 right-0 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
        </div>
        <div className="relative">
          <Link href="/" className="text-2xl font-extrabold tracking-tight">
            O&apos;K Kitchen
          </Link>
        </div>
        <div className="relative space-y-6">
          <h2 className="text-balance text-4xl font-extrabold leading-tight">
            Masak enak tanpa ribet, siap dalam menit.
          </h2>
          <p className="max-w-sm text-white/90">
            Bahan segar yang sudah dibumbui & dikemas higienis. Tinggal masak.
          </p>
          <ul className="space-y-3 text-sm">
            {[
              { icon: Leaf, t: "Bahan segar pilihan" },
              { icon: ChefHat, t: "Siap dimasak, tinggal cemplung" },
              { icon: ShieldCheck, t: "Higienis & aman" },
              { icon: Truck, t: "Pengiriman cepat" },
            ].map((f) => (
              <li key={f.t} className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white/20">
                  <f.icon className="size-5" />
                </span>
                {f.t}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs text-white/70">
          © {new Date().getFullYear()} O&apos;K Kitchen
        </p>
      </div>

      {/* Form panel */}
      <div className="relative flex flex-col">
        <div className="flex items-center justify-between p-4">
          <div className="lg:hidden">
            <Logo />
          </div>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
