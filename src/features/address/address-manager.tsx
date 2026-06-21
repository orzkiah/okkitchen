"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { MapPin, Plus, Pencil, Trash2, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { addressSchema, type AddressInput } from "@/lib/zod/address";

export interface Address extends AddressInput {
  id: string;
}

async function fetchAddresses(): Promise<Address[]> {
  const res = await fetch("/api/addresses");
  if (!res.ok) throw new Error("Gagal memuat alamat");
  return (await res.json()).addresses;
}

export function AddressManager() {
  const qc = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Address | null>(null);

  const { data: addresses, isLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: fetchAddresses,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddressInput>({ resolver: zodResolver(addressSchema) });

  function openCreate() {
    setEditing(null);
    reset({
      label: "",
      recipient: "",
      phone: "",
      province: "",
      city: "",
      district: "",
      postalCode: "",
      fullAddress: "",
      isDefault: false,
    });
    setOpen(true);
  }

  function openEdit(a: Address) {
    setEditing(a);
    reset(a);
    setOpen(true);
  }

  const save = useMutation({
    mutationFn: async (data: AddressInput) => {
      const url = editing ? `/api/addresses/${editing.id}` : "/api/addresses";
      const res = await fetch(url, {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Gagal menyimpan");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["addresses"] });
      toast.success(editing ? "Alamat diperbarui" : "Alamat ditambahkan");
      setOpen(false);
    },
    onError: (e) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/addresses/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Alamat dihapus");
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Alamat Pengiriman</h2>
          <Button size="sm" variant="gradient" onClick={openCreate}>
            <Plus className="size-4" /> Tambah
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[0, 1].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : !addresses?.length ? (
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-secondary text-muted-foreground">
              <MapPin className="size-7" />
            </div>
            <p className="font-medium">Belum ada alamat</p>
            <p className="text-sm text-muted-foreground">
              Tambahkan alamat untuk mempermudah checkout.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map((a) => (
              <div
                key={a.id}
                className="flex items-start justify-between gap-4 rounded-xl border p-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{a.label}</span>
                    {a.isDefault && (
                      <Badge variant="accent" className="gap-1">
                        <Star className="size-3" /> Utama
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm font-medium">
                    {a.recipient} · {a.phone}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {a.fullAddress}, {a.district}, {a.city}, {a.province} {a.postalCode}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(a)} aria-label="Edit">
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => remove.mutate(a.id)}
                    aria-label="Hapus"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Alamat" : "Tambah Alamat"}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleSubmit((d) => save.mutate(d))}
            className="space-y-3"
          >
            <div className="grid grid-cols-2 gap-3">
              <Field label="Label" error={errors.label?.message}>
                <Input placeholder="Rumah / Kos" {...register("label")} />
              </Field>
              <Field label="Penerima" error={errors.recipient?.message}>
                <Input {...register("recipient")} />
              </Field>
            </div>
            <Field label="No. Telepon" error={errors.phone?.message}>
              <Input placeholder="0812xxxx" {...register("phone")} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Provinsi" error={errors.province?.message}>
                <Input {...register("province")} />
              </Field>
              <Field label="Kota" error={errors.city?.message}>
                <Input {...register("city")} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Kecamatan" error={errors.district?.message}>
                <Input {...register("district")} />
              </Field>
              <Field label="Kode Pos" error={errors.postalCode?.message}>
                <Input {...register("postalCode")} />
              </Field>
            </div>
            <Field label="Alamat Lengkap" error={errors.fullAddress?.message}>
              <textarea
                className="flex min-h-20 w-full rounded-lg border border-input bg-background px-3.5 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Nama jalan, nomor rumah, RT/RW, patokan"
                {...register("fullAddress")}
              />
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                {...register("isDefault")}
                className="h-4 w-4 rounded border-input accent-[hsl(var(--primary))]"
              />
              Jadikan alamat utama
            </label>

            <DialogFooter className="gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Batal
              </Button>
              <Button type="submit" variant="gradient" disabled={isSubmitting || save.isPending}>
                {(isSubmitting || save.isPending) && <Loader2 className="size-4 animate-spin" />}
                Simpan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
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
