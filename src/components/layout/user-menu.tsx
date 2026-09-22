"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User, Package, MapPin, Lock, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

function initials(name?: string | null) {
  if (!name) return "OK";
  return name
    .split(" ")
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();
}

export function UserMenu({ navLinks }: { navLinks?: unknown } = {}) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="h-9 w-20 animate-pulse rounded-lg bg-muted" />;
  }

  if (!session?.user) {
    return (
      <Button asChild variant="gradient" size="sm" className="rounded-full">
        <Link href="/login">
          <User className="size-4" /> Masuk
        </Link>
      </Button>
    );
  }

  const { name, email, image, role } = session.user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring">
          <Avatar className="h-9 w-9 border">
            {image && <AvatarImage src={image} alt={name ?? ""} />}
            <AvatarFallback>{initials(name)}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="flex flex-col">
          <span className="truncate">{name}</span>
          <span className="truncate text-xs font-normal text-muted-foreground">{email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />


        {role === "ADMIN" && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/admin">
                <LayoutDashboard /> Dashboard Admin
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem asChild>
          <Link href="/profile">
            <User /> Profil Saya
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/orders">
            <Package /> Pesanan Saya
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/addresses">
            <MapPin /> Alamat
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/security">
            <Lock /> Keamanan
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut /> Keluar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
