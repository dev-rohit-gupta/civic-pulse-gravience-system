import z from "zod";

export const SystemRoleSchema = z.object({
  id: z.string(),
  name: z.string().min(2).max(50),
  description: z.string().max(500).nullable(),
  permissions: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
});

export type SystemRole = z.infer<typeof SystemRoleSchema>;
