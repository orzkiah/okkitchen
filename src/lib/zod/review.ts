import { z } from "zod";

export const reviewSchema = z.object({
  orderItemId: z.string().min(1),
  rating: z.number().int().min(1, "Beri rating bintang").max(5),
  comment: z.string().max(1000).optional(),
  photos: z.array(z.string().url()).max(5).optional(),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
