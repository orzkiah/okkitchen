import { z } from "zod";

export const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        variantId: z.string().optional(),
        quantity: z.number().int().min(1),
      })
    )
    .min(1, "Keranjang kosong"),
  addressId: z.string().min(1, "Pilih alamat pengiriman"),
  courierId: z.string().min(1, "Pilih kurir"),
  voucherCode: z.string().optional(),
  paymentMethod: z.enum(["QRIS", "BANK_TRANSFER", "EWALLET"]),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
