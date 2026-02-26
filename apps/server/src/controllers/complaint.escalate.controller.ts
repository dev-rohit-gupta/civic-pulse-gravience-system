import { escalateComplaintService, getEscalationHistoryService } from "../services/complaint.escalate.js";
import { Request, Response } from "express";
import { asyncHandler } from "@civic-pulse/utils";
import { ApiResponse } from "@civic-pulse/utils";
import { ApiError } from "@civic-pulse/utils";
import { z } from "zod";

const escalateComplaintSchema = z.object({
  reason: z.string().min(10, "Escalation reason must be at least 10 characters").max(500),
});

export const escalateComplaintController = asyncHandler(
  async (req: Request, res: Response) => {
    const complaintId = req.params.id;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId || !userRole) {
      throw new ApiError(401, "Unauthorized");
    }

    const parsedBody = escalateComplaintSchema.safeParse(req.body);
    if (!parsedBody.success) {
      throw new ApiError(400, parsedBody.error.issues[0].message);
    }

    const result = await escalateComplaintService(
      complaintId,
      parsedBody.data,
      userRole,
      userId
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          result,
          result.message,
          200
        )
      );
  }
);

export const getEscalationHistoryController = asyncHandler(
  async (req: Request, res: Response) => {
    const complaintId = req.params.id;
    const userId = req.user?.id;

    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }

    const historyData = await getEscalationHistoryService(complaintId);

    return res
      .status(200)
      .json(
        new ApiResponse(
          historyData,
          "Escalation history retrieved successfully",
          200
        )
      );
  }
);
