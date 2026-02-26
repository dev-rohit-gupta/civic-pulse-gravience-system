import z from "zod";

export const UserRoleSchema = z.enum(["citizen", "department", "contractor", "admin"]);

export type UserRole = z.infer<typeof UserRoleSchema>;