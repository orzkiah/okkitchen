import { z } from "zod";

export const addressSchema = z.object({
  label: z.string().min(1, "Label wajib diisi").max(30),
  recipient: z.string().min(2, "Nama penerima wajib diisi").max(60),
  phone: z.string().min(9, "Nomor telepon tidak valid").max(20).regex(/^[0-9+]+$/),
  province: z.string().min(2, "Provinsi wajib diisi"),
  city: z.string().min(2, "Kota wajib diisi"),
  district: z.string().min(2, "Kecamatan wajib diisi"),
  postalCode: z.string().min(4, "Kode pos tidak valid").max(10),
  fullAddress: z.string().min(5, "Alamat lengkap wajib diisi"),
  isDefault: z.boolean().optional(),
});

export type AddressInput = z.infer<typeof addressSchema>;
