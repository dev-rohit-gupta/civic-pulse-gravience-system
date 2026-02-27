import { registerComplaintService } from "../services/complaint.register.js";
import { getAllComplaintsService, getComplaintDetailsService, deleteComplaintService } from "../services/complaint.js";
import { Request, Response } from "express";
import { asyncHandler } from "@civic-pulse/utils";
import { ApiResponse } from "@civic-pulse/utils";
import { ApiError } from "@civic-pulse/utils";
import { ComplaintSchema } from "@civic-pulse/schemas";

const bodySchema = ComplaintSchema.pick({
  title: true,
  description: true,
  image: true,
  location: true,
});

export const registerComplaintController = asyncHandler(async (req: Request, res: Response) => {
  const citizen = req.user?.id;
  if (!citizen) {
    throw new ApiError(401, "Unauthorized");
  }

  // Parse location if sent as JSON string from FormData
  let parsedBody = { ...req.body };
  if (typeof req.body.location === 'string') {
    try {
      parsedBody.location = JSON.parse(req.body.location);
    } catch (e) {
      parsedBody.location = undefined;
    }
  }

  const { title, description, location } = bodySchema.parse(parsedBody);
  const image = req.file?.buffer;

  const complaint = await registerComplaintService(
    citizen,
    {
      title,
      description,
      location,
    },
    image
  );

  return res.status(201).json(
    new ApiResponse(
      { complaint }, 
      "Complaint registered successfully! AI is analyzing and assigning it to the appropriate department.", 
      201
    )
  );
});

export const getAllComplaintsController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const userRole = req.user?.role;

  if (!userId || !userRole) {
    throw new ApiError(401, "Unauthorized");
  }

  const filters = {
    status: req.query.status as string | undefined,
    priority: req.query.priority as string | undefined,
    category: req.query.category as string | undefined,
    search: req.query.search as string | undefined,
  };

  const complaints = await getAllComplaintsService(userRole, userId, filters);

  return res.status(200).json(
    new ApiResponse(complaints, "Complaints fetched successfully", 200)
  );
});

export const getComplaintDetailsController = asyncHandler(async (req: Request, res: Response) => {
  const complaintId = req.params.id;
  const userId = req.user?.id;
  const userRole = req.user?.role;

  if (!userId || !userRole) {
    throw new ApiError(401, "Unauthorized");
  }

  const complaint = await getComplaintDetailsService(complaintId, userRole, userId);

  return res.status(200).json(
    new ApiResponse(complaint, "Complaint details fetched successfully", 200)
  );
});

export const deleteComplaintController = asyncHandler(async (req: Request, res: Response) => {
  const complaintId = req.params.id;
  const userRole = req.user?.role;
  const userId = req.user?.id;

  if (!userRole || !userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const result = await deleteComplaintService(complaintId, userRole, userId);

  return res.status(200).json(
    new ApiResponse(result, "Complaint deleted successfully", 200)
  );
});
