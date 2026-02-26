import z from "zod";
import { UserSchema } from "../user/user.schema.js";

export const ActivityLogSchema = z.object({
    user : UserSchema,
    activity : z.string(),
    performedData : z.date().default(()=> new Date())
})

export type ActivityLog = z.infer<typeof ActivityLogSchema>