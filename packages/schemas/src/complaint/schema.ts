import z from "zod";
import { urlSchema } from "../util.schemas.js";
import { UserSchema } from "../user/user.schema.js";
import { DepartmentSchema } from "../department/schema.js";

export const ComplaintSchema = z.object({
  citizen: UserSchema,
  title: z.string().min(5).max(200),
  description: z.string().min(10).max(2000),
  image: urlSchema,
  location: z.object({
    coordinates: z.tuple([z.number(), z.number()]), // [lng, lat]
  }),
  category: z.enum(["Road", "Water", "Electricity", "Garbage", "Other"]),
  supporters: z.array(z.string()).nullable(),
  semanticVector: z.array(z.number()).nullable(),
  canonicalHash: z.string().nullable(),
  department: DepartmentSchema,
  operator: UserSchema.nullable(),
  status: z
    .enum([
        "pending",
        "assigned",
        "under_progress",
        "resolved",
        "closed",
        "rejected",
      ])
    .default("pending"),
  priorityScore: z.number().default(0),
  resolvedAt: z.date().nullable(),
  closedAt: z.date().nullable(),
  createdAt: z.date().default(() => new Date()),
});

export type Complaint = z.infer<typeof ComplaintSchema>;

export interface newComplaint {
  title: string;
  description: string;
  location: {
    coordinates: [number, number];
  };
}