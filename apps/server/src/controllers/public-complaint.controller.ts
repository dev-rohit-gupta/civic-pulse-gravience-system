import { Request, Response } from "express";
import { asyncHandler } from "@civic-pulse/utils";
import { ApiResponse } from "@civic-pulse/utils";
import { ApiError } from "@civic-pulse/utils";
import { 
  registerPublicComplaintService,
  trackPublicComplaintService,
  searchPublicComplaintsService
} from "../services/public-complaint.service.js";

/**
 * Register a public complaint (no authentication required)
 * Citizens can submit complaints without logging in
 */
export const registerPublicComplaintController = asyncHandler(async (req: Request, res: Response) => {
  const complaintData = req.body;
  
  // Basic validation
  if (!complaintData.name || !complaintData.mobile || !complaintData.category || 
      !complaintData.subject || !complaintData.description || !complaintData.city) {
    throw new ApiError(400, "Please provide all required fields: name, mobile, category, subject, description, and city", false);
  }

  // Validate mobile number (10 digits)
  if (!/^\d{10}$/.test(complaintData.mobile)) {
    throw new ApiError(400, "Invalid mobile number. Must be 10 digits.", false);
  }

  // Validate Aadhaar if provided (12 digits)
  if (complaintData.aadhaar && !/^\d{12}$/.test(complaintData.aadhaar.replace(/\s/g, ''))) {
    throw new ApiError(400, "Invalid Aadhaar number. Must be 12 digits.", false);
  }

  const result = await registerPublicComplaintService(complaintData, req.file);
  
  res.status(201).json(new ApiResponse(result, "Complaint registered successfully. Please save your reference ID for tracking.", 201));
});

/**
 * Track complaint by reference ID (no authentication required)
 */
export const trackPublicComplaintController = asyncHandler(async (req: Request, res: Response) => {
  const { complaintId } = req.params;
  
  if (!complaintId) {
    throw new ApiError(400, "Complaint ID is required", false);
  }

  const complaintDetails = await trackPublicComplaintService(complaintId);
  
  res.status(200).json(new ApiResponse(complaintDetails, "Complaint details retrieved successfully", 200));
});

/**
 * Search public complaints (no authentication required)
 * Limited information exposed for privacy
 */
export const searchPublicComplaintsController = asyncHandler(async (req: Request, res: Response) => {
  const { query, status, category, city, limit = 50 } = req.query;
  
  const filters = {
    query: query as string,
    status: status as string,
    category: category as string,
    city: city as string,
    limit: parseInt(limit as string) || 50
  };

  const complaints = await searchPublicComplaintsService(filters);
  
  res.status(200).json(new ApiResponse(complaints, "Complaints retrieved successfully", 200));
});
