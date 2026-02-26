import { registerComplaintService } from "../services/complaint.register.js";
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
  const { title, description, location } = bodySchema.parse(req.body);
  const citizen = req.user?.id;
  if (!citizen) {
    throw new ApiError(401, "Unauthorized");
  }

  const image = req.file?.buffer;
  if (!image) {
    throw new ApiError(400, "Image is required");
  }

  const complaint = await registerComplaintService(
    citizen,
    {
      title,
      description,
      location,
    },
    image
  );

  return res.status(201).json(new ApiResponse(null, "Complaint registered successfully", 201));
});
