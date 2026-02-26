import z from "zod";
import { emailSchema } from "../util.schemas.js";
import { UserRoleSchema } from "./role.schema.js";
import { DepartmentSchema } from "../department/schema.js";

export const UserSchema = z.object({
  id: z.string(),
  fullname: z.string().min(2).max(100),
  email: emailSchema,
  aadhaar: z.string().length(12),
  password: z.string().min(8).max(100),
  phone : z.string().length(10),
  role: UserRoleSchema,

  // Department Specific
  department: DepartmentSchema.nullable(),
});

export type User = z.infer<typeof UserSchema>;
