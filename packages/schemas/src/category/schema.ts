import z from "zod";

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string().min(2).max(50),
  description: z.string().max(500).nullable(),
  icon: z.string().nullable(),
  isActive: z.boolean().default(true),
});

export type Category = z.infer<typeof CategorySchema>;
