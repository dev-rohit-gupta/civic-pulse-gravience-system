import z from "zod";
import { urlSchema } from "../util.schemas.js";
import { UserSchema } from "../user/user.schema.js";
import { DepartmentSchema } from "../department/schema.js";

const EscalationHistorySchema = z.object({
  escalatedBy: z.string(), // User ID
  escalatedAt: z.date(),
  reason: z.string(),
  fromRole: z.enum(["operator", "department", "admin"]),
  toRole: z.enum(["operator", "department", "admin"]),
});

export const ComplaintSchema = z.object({
  id: z.string().optional(), // Public submission ID
  citizen: UserSchema.optional(),
  title: z.string().min(5).max(200),
  description: z.string().min(10).max(2000),
  image: urlSchema.optional(),
  location: z.object({
    coordinates: z.tuple([z.number(), z.number()]), // [lng, lat]
  }).optional(),
  category: z.enum(["Road", "Water", "Electricity", "Garbage", "Other"]),
  // Public submission fields
  isPublicSubmission: z.boolean().default(false).optional(),
  citizenName: z.string().optional(),
  citizenPhone: z.string().optional(),
  citizenAadhaar: z.string().optional(),
  citizenEmail: z.string().optional(),
  city: z.string().optional(),
  ward: z.string().optional(),
  address: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  supporters: z.array(z.string()).nullable(),
  semanticVector: z.array(z.number()).nullable(),
  canonicalHash: z.string().nullable(),
  department: DepartmentSchema.optional(),
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
  priorityScore: z.number().default(0).optional(),
  resolvedAt: z.date().nullable(),
  closedAt: z.date().nullable(),
  escalationLevel: z.number().default(0),
  escalationHistory: z.array(EscalationHistorySchema).default([]),
  currentHandler: z.string().nullable(),
  createdAt: z.date().default(() => new Date()),
});

export type Complaint = z.infer<typeof ComplaintSchema>;

export interface newComplaint {
  title: string;
  description: string;
  location?: {
    coordinates: [number, number];
  };
}