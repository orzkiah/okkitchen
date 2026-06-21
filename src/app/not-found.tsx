import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <Logo />
      <div className="space-y-2">
        <p className="text-7xl font-extrabold brand-gradient-text">404</p>
        <h1 className="text-2xl font-bold">Halaman tidak ditemukan</h1>
        <p className="max-w-sm text-muted-foreground">
          Sepertinya menu yang kamu cari sudah habis atau pindah dapur. Yuk kembali dan pilih yang lain.
        </p>
      </div>
      <div className="flex gap-3">
        <Button asChild variant="gradient">
          <Link href="/">Ke Beranda</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/products">Lihat Menu</Link>
        </Button>
      </div>
    </div>
  );
}
