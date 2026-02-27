import { getDashboardStatsService } from "../services/dashboard.service.js";
import { Request, Response } from "express";
import { asyncHandler } from "@civic-pulse/utils";
import { ApiResponse } from "@civic-pulse/utils";
import { ApiError } from "@civic-pulse/utils";

export const getDashboardStatsController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const userRole = req.user?.role;

  if (!userId || !userRole) {
    throw new ApiError(401, "Unauthorized");
  }

  const stats = await getDashboardStatsService(userRole, userId);

  return res.status(200).json(
    new ApiResponse(stats, "Dashboard statistics fetched successfully", 200)
  );
});
