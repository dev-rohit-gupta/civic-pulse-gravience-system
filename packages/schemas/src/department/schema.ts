import z from "zod";

export const DepartmentSchema = z.object({
  id: z.string(),
  title: z.string().min(2).max(100),
  description: z.string().max(500).nullable(),
  category: z.string(), // Category ID reference (ObjectId as string)
});

export type Department = z.infer<typeof DepartmentSchema>;