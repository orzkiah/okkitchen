import { z } from "zod";

export const voucherSchema = z.object({
  code: z.string().min(3, "Kode minimal 3 karakter").max(20).transform((s) => s.toUpperCase()),
  description: z.string().optional(),
  type: z.enum(["PERCENT", "FIXED"]),
  value: z.coerce.number().int().min(1),
  minSpend: z.coerce.number().int().min(0).default(0),
  maxDiscount: z.coerce.number().int().min(0).optional(),
  quota: z.coerce.number().int().min(0).optional(),
  isActive: z.boolean().default(true),
  expiresAt: z.string().optional(),
});

export type VoucherFormInput = z.input<typeof voucherSchema>;
export type VoucherInput = z.output<typeof voucherSchema>;
