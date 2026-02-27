import z from "zod";
import { CategorySchema } from "../category/schema.js";
export const DepartmentSchema = z.object({
  id: z.string(),
  title: z.string().min(2).max(100),
  description: z.string().max(500).nullable(),
  category : CategorySchema,
});

export type Department = z.infer<typeof DepartmentSchema>;