"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/features/upload/image-upload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateProfileSchema, type UpdateProfileInput } from "@/lib/zod/auth";

interface Props {
  initial: { name: string; email: string; whatsapp: string; image: string };
}

export function ProfileForm({ initial }: Props) {
  const { update } = useSession();
  const [loading, setLoading] = React.useState(false);
  const [image, setImage] = React.useState(initial.image);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: initial.name,
      whatsapp: initial.whatsapp,
      image: initial.image,
    },
  });

  async function onSubmit(data: UpdateProfileInput) {
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, image }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error("Gagal", { description: json.error });
        return;
      }
      await update({ name: data.name, image });
      toast.success("Profil diperbarui");
    } catch {
      toast.error("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profil</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="flex items-center gap-4">
            <ImageUpload
              value={image}
              onChange={setImage}
              folder="okkitchen/avatars"
              rounded
              className="h-24 w-24"
            />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Foto Profil</p>
              <p>JPG/PNG. Klik untuk mengunggah.</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={initial.email} disabled />
            <p className="text-xs text-muted-foreground">Email tidak dapat diubah.</p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="whatsapp">Nomor WhatsApp</Label>
            <Input id="whatsapp" {...register("whatsapp")} />
            {errors.whatsapp && (
              <p className="text-xs text-destructive">{errors.whatsapp.message}</p>
            )}
          </div>

          <Button type="submit" variant="gradient" disabled={loading}>
            {loading && <Loader2 className="size-4 animate-spin" />}
            Simpan Perubahan
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
