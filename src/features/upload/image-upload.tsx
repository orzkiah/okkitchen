"use client";

import * as React from "react";
import Image from "next/image";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  className?: string;
  rounded?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  folder = "okkitchen",
  className,
  rounded,
}: ImageUploadProps) {
  const [loading, setLoading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setLoading(true);
    try {
      const sigRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder }),
      });
      const sig = await sigRes.json();
      if (!sigRes.ok) throw new Error(sig.error ?? "Gagal menyiapkan upload");

      const form = new FormData();
      form.append("file", file);
      form.append("api_key", sig.apiKey);
      form.append("timestamp", String(sig.timestamp));
      form.append("signature", sig.signature);
      form.append("folder", folder);

      const upRes = await fetch(
        `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
        { method: "POST", body: form }
      );
      const up = await upRes.json();
      if (!upRes.ok) throw new Error(up.error?.message ?? "Upload gagal");

      onChange(up.secure_url);
      toast.success("Foto berhasil diunggah");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload gagal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={cn(
        "relative grid place-items-center overflow-hidden border-2 border-dashed border-input bg-secondary/40 transition-colors hover:border-primary",
        rounded ? "rounded-full" : "rounded-xl",
        className
      )}
    >
      {value ? (
        <>
          <Image src={value} alt="Preview" fill className="object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-1 top-1 z-10 grid h-6 w-6 place-items-center rounded-full bg-destructive text-white"
            aria-label="Hapus foto"
          >
            <X className="size-3.5" />
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center gap-1 p-4 text-center text-xs text-muted-foreground"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <Upload className="size-5" />
          )}
          <span>{loading ? "Mengunggah..." : "Unggah foto"}</span>
        </button>
      )}

      {value && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="absolute inset-0 z-0 cursor-pointer"
          aria-label="Ganti foto"
        />
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}
