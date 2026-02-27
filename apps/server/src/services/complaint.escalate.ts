import { ComplaintModel } from "../model/complaint.model.js";
import { UserModel } from "../model/user.model.js";
import { ApiError } from "@civic-pulse/utils";
import mongoose from "mongoose";
import { sendEscalationEmail } from "./email.service.js";
import { createActivityLogService } from "./activity.service.js";

interface EscalateComplaintData {
  reason: string;
}

/**
 * Escalation hierarchy:
 * operator → department → admin
 */
export async function escalateComplaintService(
  complaintId: string,
  escalationData: EscalateComplaintData,
  userRole: string,
  userId: string
) {
  const complaint: any = await ComplaintModel.findById(complaintId).lean();
  
  if (!complaint) {
    throw new ApiError(404, "Complaint not found");
  }

  // Check if user is the current handler or has permission to escalate
  const currentHandlerId = complaint.currentHandler?.toString() || complaint.operator?.toString();
  
  if (userRole === "operator") {
    // Operator can only escalate their own assigned complaints
    if (currentHandlerId !== userId) {
      throw new ApiError(403, "You can only escalate complaints assigned to you");
    }
  } else if (userRole === "department") {
    // Department can escalate complaints in their department
    // We'll allow department to escalate any complaint for now
  } else if (userRole === "admin") {
    throw new ApiError(400, "Admin is the highest level - cannot escalate further");
  } else {
    throw new ApiError(403, "You don't have permission to escalate complaints");
  }

  // Determine next level in hierarchy
  let toRole: "operator" | "department" | "admin";
  let nextHandler: mongoose.Types.ObjectId | null = null;
  let nextHandlerEmail = "";
  let nextHandlerName = "";

  if (userRole === "operator") {
    // Operator escalates to department
    toRole = "department";
    // Find a department user to assign to
    const departmentUser = await UserModel.findOne({ 
      role: "department",
      department: complaint.department 
    }).select("_id email fullname");
    
    if (departmentUser) {
      nextHandler = departmentUser._id as mongoose.Types.ObjectId;
      nextHandlerEmail = (departmentUser as any).email || "";
      nextHandlerName = (departmentUser as any).fullname || "Department User";
    }
  } else if (userRole === "department") {
    // Department escalates to admin of SAME department
    toRole = "admin";
    
    // Find admin user assigned to this complaint's department
    const adminUser = await UserModel.findOne({ 
      role: "admin",
      department: complaint.department // Find admin of this specific department
    }).select("_id email fullname");
    
    if (adminUser) {
      nextHandler = adminUser._id as mongoose.Types.ObjectId;
      nextHandlerEmail = (adminUser as any).email || "";
      nextHandlerName = (adminUser as any).fullname || "Admin User";
    } else {
      // Fallback: If no department-specific admin, find any admin
      const fallbackAdmin = await UserModel.findOne({ role: "admin" }).select("_id email fullname");
      if (fallbackAdmin) {
        nextHandler = fallbackAdmin._id as mongoose.Types.ObjectId;
        nextHandlerEmail = (fallbackAdmin as any).email || "";
        nextHandlerName = (fallbackAdmin as any).fullname || "Admin User";
      }
    }
  } else {
    throw new ApiError(400, "Cannot determine escalation path");
  }

  // Get escalating user details
  const escalatingUser = await UserModel.findById(userId).select("fullname");
  const escalatingUserName = (escalatingUser as any)?.fullname || "Unknown User";

  // Create escalation history entry
  const escalationEntry = {
    escalatedBy: new mongoose.Types.ObjectId(userId),
    escalatedAt: new Date(),
    reason: escalationData.reason,
    fromRole: userRole as "operator" | "department" | "admin",
    toRole: toRole,
  };

  // Update the complaint
  const updatedComplaint = await ComplaintModel.findByIdAndUpdate(
    complaintId,
    {
      $inc: { escalationLevel: 1 },
      $push: { escalationHistory: escalationEntry },
      $set: { 
        currentHandler: nextHandler,
        status: "assigned" // Reset status when escalated
      },
    },
    { new: true }
  );

  // Log escalation activity
  await createActivityLogService(
    userId,
    `Complaint ${complaintId} escalated from ${userRole} to ${toRole} - Reason: ${escalationData.reason.substring(0, 100)}${escalationData.reason.length > 100 ? '...' : ''}`
  ).catch(err => console.error("Failed to log activity:", err));

  // Send email notification to the next level (non-recursive - only one level up)
  if (nextHandlerEmail) {
    const newEscalationLevel = (complaint.escalationLevel || 0) + 1;
    
    // Send email asynchronously (don't wait for it)
    sendEscalationEmail({
      recipientEmail: nextHandlerEmail,
      recipientName: nextHandlerName,
      complaintId: complaint._id.toString(),
      complaintTitle: complaint.title || "Untitled Complaint",
      complaintDescription: complaint.description || "No description",
      escalatedBy: escalatingUserName,
      escalatedFrom: userRole.charAt(0).toUpperCase() + userRole.slice(1),
      escalatedTo: toRole.charAt(0).toUpperCase() + toRole.slice(1),
      reason: escalationData.reason,
      escalationLevel: newEscalationLevel,
    }).catch((error) => {
      console.error("Failed to send escalation email:", error);
    });
  }

  return {
    complaint: updatedComplaint?.toObject(),
    escalatedTo: toRole,
    message: `Complaint escalated to ${toRole} successfully`,
  };
}

/**
 * Get escalation history for a complaint
 */
export async function getEscalationHistoryService(complaintId: string) {
  const complaint: any = await ComplaintModel.findById(complaintId)
    .populate("escalationHistory.escalatedBy", "fullname role")
    .lean();
  
  if (!complaint) {
    throw new ApiError(404, "Complaint not found");
  }

  return {
    escalationLevel: complaint.escalationLevel || 0,
    escalationHistory: complaint.escalationHistory || [],
  };
}
