"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Ticket,
  BarChart3,
  LogOut,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Produk", icon: Package },
  { href: "/admin/orders", label: "Pesanan", icon: ShoppingBag },
  { href: "/admin/customers", label: "Pelanggan", icon: Users },
  { href: "/admin/vouchers", label: "Voucher", icon: Ticket },
  { href: "/admin/reports", label: "Laporan", icon: BarChart3 },
];

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <div className="flex h-full flex-col gap-1 p-3">
      <Link href="/admin" className="mb-4 flex items-center gap-2.5 px-2 py-2">
        <span className="grid h-9 w-9 place-items-center rounded-xl brand-gradient text-sm font-extrabold text-white">
          O&apos;K
        </span>
        <span className="flex flex-col leading-none">
          <span className="text-sm font-extrabold">Admin Panel</span>
          <span className="text-[10px] text-muted-foreground">O&apos;K Kitchen</span>
        </span>
      </Link>

      {LINKS.map((l) => {
        const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground shadow-soft"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <l.icon className="size-4" />
            {l.label}
          </Link>
        );
      })}

      <div className="mt-auto space-y-1 border-t pt-2">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          <Store className="size-4" /> Lihat Toko
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10"
        >
          <LogOut className="size-4" /> Keluar
        </button>
      </div>
    </div>
  );
}
