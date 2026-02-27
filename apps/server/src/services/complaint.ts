import { ComplaintModel } from "../model/complaint.model.js";
import { Complaint , newComplaint } from "@civic-pulse/schemas";
import { analyzeComplaintForSpamService } from "./spam.detect.service.js";
import { createCanonicalHash } from "@civic-pulse/utils";
import { checkForDuplicateComplaintService } from "./duplicate.check.js";
import { getS3Object } from "./aws.service.js";
import { UserModel } from "../model/user.model.js";
import { ApiError } from "@civic-pulse/utils";
import mongoose from "mongoose";

export async function getComplaintsService(coordinates: [number, number], radius: number) {
    const complaints = await ComplaintModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [
                    [coordinates[0], coordinates[1]],
                    radius / 6378100 // Convert radius from meters to radians
                ]
            }
        }
    }).lean()
    return complaints;
}

export async function getComplaintService(id : string) {
    
    const complaint = await ComplaintModel.findById(id)
    .select("id title description image location createdAt updatedAt")

    const imageData = await getS3Object(complaint?.image!);

    return { ...complaint, imageData };
}

/**
 * Get all complaints with role-based filtering
 */
export async function getAllComplaintsService(
  userRole: string,
  userId: string,
  filters?: {
    status?: string;
    priority?: string;
    category?: string;
    search?: string;
  }
) {
  const user = await UserModel.findById(userId).select("department");
  
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  let query: any = {};

  // Role-based filtering
  if (userRole === "citizen") {
    query.citizen = new mongoose.Types.ObjectId(userId);
  } else if (userRole === "operator") {
    query.operator = new mongoose.Types.ObjectId(userId);
  } else if (userRole === "department") {
    query.department = (user as any).department;
  } else if (userRole === "admin") {
    // Admin sees complaints from their department only
    query.department = (user as any).department;
  }

  // Apply additional filters
  if (filters?.status) {
    query.status = filters.status;
  }
  if (filters?.category) {
    query.category = filters.category;
  }

  const complaints = await ComplaintModel.find(query)
    .populate("citizen", "fullname email phone")
    .populate("operator", "fullname email department")
    .populate("department", "title category")
    .populate("currentHandler", "fullname role")
    .sort({ createdAt: -1 })
    .lean();

  // Search filter (applied after fetch for simplicity)
  let filteredComplaints = complaints;
  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    filteredComplaints = complaints.filter((c: any) => 
      c.title?.toLowerCase().includes(searchLower) ||
      c.description?.toLowerCase().includes(searchLower) ||
      c.citizen?.fullname?.toLowerCase().includes(searchLower)
    );
  }

  return filteredComplaints;
}

/**
 * Get single complaint details with full population
 */
export async function getComplaintDetailsService(
  complaintId: string,
  userRole: string,
  userId: string
) {
  const complaint: any = await ComplaintModel.findById(complaintId)
    .populate("citizen", "fullname email phone")
    .populate("operator", "fullname email department")
    .populate("department", "title category description")
    .populate("currentHandler", "fullname role email")
    .populate("escalationHistory.escalatedBy", "fullname role")
    .lean();

  if (!complaint) {
    throw new ApiError(404, "Complaint not found");
  }

  // Permission check - users can only view complaints they have access to
  const user = await UserModel.findById(userId).select("department");
  
  if (userRole === "citizen") {
    if (complaint.citizen?._id?.toString() !== userId) {
      throw new ApiError(403, "You can only view your own complaints");
    }
  } else if (userRole === "operator") {
    if (complaint.operator?._id?.toString() !== userId) {
      throw new ApiError(403, "You can only view complaints assigned to you");
    }
  } else if (userRole === "department") {
    if (complaint.department?._id?.toString() !== (user as any)?.department?.toString()) {
      throw new ApiError(403, "You can only view complaints in your department");
    }
  }
  // Admin has full access

  return complaint;
}

/**
 * Delete complaint (admin only, department-scoped)
 */
export async function deleteComplaintService(
  complaintId: string,
  userRole: string,
  userId: string
) {
  if (userRole !== "admin") {
    throw new ApiError(403, "Only administrators can delete complaints");
  }

  const complaint: any = await ComplaintModel.findById(complaintId);
  
  if (!complaint) {
    throw new ApiError(404, "Complaint not found");
  }

  // Verify admin can only delete complaints from their department
  const adminUser = await UserModel.findById(userId).select("department");
  if ((adminUser as any)?.department?.toString() !== complaint.department?.toString()) {
    throw new ApiError(403, "You can only delete complaints from your department");
  }

  await ComplaintModel.findByIdAndDelete(complaintId);

  return { deleted: true, complaintId };
}

