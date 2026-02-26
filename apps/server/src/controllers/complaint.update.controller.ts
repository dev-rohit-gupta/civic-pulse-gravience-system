import { updateComplaintService } from "../services/complaint.update.js";
import { Request, Response } from "express";
import { asyncHandler } from "@civic-pulse/utils";
import { ApiResponse } from "@civic-pulse/utils";
import { ApiError } from "@civic-pulse/utils";
import { z } from "zod";

const updateComplaintSchema = z.object({
  status: z.enum([
    "pending",
    "assigned",
    "under_progress",
    "resolved",
    "closed",
    "rejected",
  ]).optional(),
  operator: z.string().optional(),
});

export const updateComplaintController = asyncHandler(
  async (req: Request, res: Response) => {
    const complaintId = req.params.id;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId || !userRole) {
      throw new ApiError(401, "Unauthorized");
    }

    const parsedBody = updateComplaintSchema.safeParse(req.body);
    if (!parsedBody.success) {
      throw new ApiError(400, "Invalid request data");
    }

    const updatedComplaint = await updateComplaintService(
      complaintId,
      parsedBody.data,
      userRole,
      userId
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          updatedComplaint,
          "Complaint updated successfully",
          200
        )
      );
  }
);

export const assignOperatorController = asyncHandler(
  async (req: Request, res: Response) => {
    const complaintId = req.params.id;
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const { operatorId } = req.body;

    if (!userId || !userRole) {
      throw new ApiError(401, "Unauthorized");
    }

    // Only department and admin can assign operators
    if (userRole !== "department" && userRole !== "admin") {
      throw new ApiError(403, "Only department can assign operators");
    }

    if (!operatorId) {
      throw new ApiError(400, "Operator ID is required");
    }

    const updatedComplaint = await updateComplaintService(
      complaintId,
      {
        operator: operatorId,
        status: "assigned",
      },
      userRole,
      userId
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          updatedComplaint,
          "Operator assigned successfully",
          200
        )
      );
  }
);
