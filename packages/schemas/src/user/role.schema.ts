import z from "zod";

export const UserRoleSchema = z.enum(["citizen", "department", "operator", "admin"]);

export type UserRole = z.infer<typeof UserRoleSchema>;