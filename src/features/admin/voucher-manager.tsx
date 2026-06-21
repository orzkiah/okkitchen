"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Ticket, Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { voucherSchema, type VoucherFormInput } from "@/lib/zod/voucher";
import { formatRupiah } from "@/lib/utils";

interface Voucher {
  id: string;
  code: string;
  description: string | null;
  type: "PERCENT" | "FIXED";
  value: number;
  minSpend: number;
  maxDiscount: number | null;
  quota: number | null;
  usedCount: number;
  isActive: boolean;
}

export function VoucherManager() {
  const qc = useQueryClient();
  const [open, setOpen] = React.useState(false);

  const { data: vouchers, isLoading } = useQuery({
    queryKey: ["admin-vouchers"],
    queryFn: async () => {
      const res = await fetch("/api/admin/vouchers");
      if (!res.ok) throw new Error();
      return (await res.json()).vouchers as Voucher[];
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VoucherFormInput>({
    resolver: zodResolver(voucherSchema),
    defaultValues: { type: "PERCENT", isActive: true, minSpend: 0 },
  });

  const create = useMutation({
    mutationFn: async (data: VoucherFormInput) => {
      const res = await fetch("/api/admin/vouchers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Gagal");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-vouchers"] });
      toast.success("Voucher dibuat");
      setOpen(false);
      reset();
    },
    onError: (e) => toast.error(e.message),
  });

  const toggle = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      await fetch(`/api/admin/vouchers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-vouchers"] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/admin/vouchers/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-vouchers"] });
      toast.success("Voucher dihapus");
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold tracking-tight">Voucher</h1>
        <Button variant="gradient" onClick={() => setOpen(true)}>
          <Plus className="size-4" /> Buat Voucher
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : !vouchers?.length ? (
        <EmptyState icon={Ticket} title="Belum ada voucher" />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {vouchers.map((v) => (
            <Card key={v.id}>
              <CardContent className="space-y-2 p-4">
                <div className="flex items-center justify-between">
                  <span className="rounded-lg border border-dashed border-primary bg-primary/5 px-2.5 py-1 font-mono text-sm font-bold text-primary">
                    {v.code}
                  </span>
                  <Badge variant={v.isActive ? "success" : "outline"}>
                    {v.isActive ? "Aktif" : "Nonaktif"}
                  </Badge>
                </div>
                <p className="text-sm font-semibold">
                  {v.type === "PERCENT" ? `Diskon ${v.value}%` : `Potongan ${formatRupiah(v.value)}`}
                </p>
                <p className="text-xs text-muted-foreground">
                  Min. belanja {formatRupiah(v.minSpend)}
                  {v.maxDiscount ? ` · maks ${formatRupiah(v.maxDiscount)}` : ""}
                </p>
                <p className="text-xs text-muted-foreground">
                  Terpakai {v.usedCount}
                  {v.quota !== null ? ` / ${v.quota}` : ""}
                </p>
                <div className="flex gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => toggle.mutate({ id: v.id, isActive: !v.isActive })}
                  >
                    {v.isActive ? "Nonaktifkan" : "Aktifkan"}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => remove.mutate(v.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buat Voucher</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit((d) => create.mutate(d))} className="space-y-3">
            <Field label="Kode" error={errors.code?.message}>
              <Input {...register("code")} placeholder="OKHEMAT" />
            </Field>
            <Field label="Deskripsi">
              <Input {...register("description")} placeholder="Diskon pengguna baru" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Tipe">
                <select
                  {...register("type")}
                  className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm"
                >
                  <option value="PERCENT">Persen (%)</option>
                  <option value="FIXED">Nominal (Rp)</option>
                </select>
              </Field>
              <Field label="Nilai" error={errors.value?.message}>
                <Input type="number" {...register("value")} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Min. Belanja">
                <Input type="number" {...register("minSpend")} />
              </Field>
              <Field label="Maks. Diskon">
                <Input type="number" {...register("maxDiscount")} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Kuota (opsional)">
                <Input type="number" {...register("quota")} />
              </Field>
              <Field label="Berlaku Hingga">
                <Input type="date" {...register("expiresAt")} />
              </Field>
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Batal
              </Button>
              <Button type="submit" variant="gradient" disabled={create.isPending}>
                {create.isPending && <Loader2 className="size-4 animate-spin" />}
                Simpan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
