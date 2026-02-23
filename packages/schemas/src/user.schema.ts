import z from "zod";

export const UserSchema = z.object({
  id: z.string(),
  fullname: z.string().min(2).max(100),
  email: z.string().email(),
  aadhar: z.string().length(12),
  password: z.string().min(8).max(100),

});

export type User = z.infer<typeof UserSchema>;