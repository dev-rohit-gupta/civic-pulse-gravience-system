import mongoose from "mongoose";
import type { ActivityLog } from "@civic-pulse/schemas";

const ActivityLogSchema = new mongoose.Schema<ActivityLog>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  performedData: {
    type: Date,
    default: new Date(),
  },
  activity: {
    type: String,
    required: true,
  },
});

export const ActivityLogModel = mongoose.model<ActivityLog>("ActivityLog", ActivityLogSchema);
