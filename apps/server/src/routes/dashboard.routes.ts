import { Router } from "express";
import { getDashboardStatsController } from "../controllers/dashboard.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

export const dashboardRouter = Router();

// Get dashboard statistics (role-based)
dashboardRouter.get("/stats", requireAuth, getDashboardStatsController);
