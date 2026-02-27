import { Router } from "express";
import { getActivityLogsController } from "../controllers/activity.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

export const activityRouter = Router();

// Get activity logs (role-based filtering)
activityRouter.get("/", requireAuth, getActivityLogsController);
