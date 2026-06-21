"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { GoogleButton } from "./google-button";
import { loginSchema, type LoginInput } from "@/lib/zod/auth";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/";
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginInput) {
    setLoading(true);
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    setLoading(false);

    if (res?.error) {
      toast.error("Login gagal", { description: "Email atau password salah." });
      return;
    }
    toast.success("Selamat datang kembali! 👋");
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-extrabold tracking-tight">Masuk</h1>
        <p className="text-sm text-muted-foreground">
          Selamat datang kembali di O&apos;K Kitchen.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="nama@email.com" {...register("email")} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="text-xs font-medium text-primary hover:underline">
              Lupa password?
            </Link>
          </div>
          <PasswordInput id="password" placeholder="••••••••" {...register("password")} />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            {...register("remember")}
            className="h-4 w-4 rounded border-input accent-[hsl(var(--primary))]"
          />
          Ingat saya
        </label>

        <Button type="submit" variant="gradient" className="w-full" disabled={loading}>
          {loading && <Loader2 className="size-4 animate-spin" />}
          Masuk
        </Button>
      </form>

      <div className="relative text-center">
        <span className="relative z-10 bg-background px-3 text-xs text-muted-foreground">
          atau
        </span>
        <div className="absolute inset-0 top-1/2 h-px bg-border" />
      </div>

      <GoogleButton callbackUrl={callbackUrl} />

      <p className="text-center text-sm text-muted-foreground">
        Belum punya akun?{" "}
        <Link href="/register" className="font-semibold text-primary hover:underline">
          Daftar sekarang
        </Link>
      </p>
    </div>
  );
}
