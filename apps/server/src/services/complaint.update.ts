import { ComplaintModel } from "../model/complaint.model.js";
import { UserModel } from "../model/user.model.js";
import { ApiError } from "@civic-pulse/utils";
import mongoose from "mongoose";
import { sendStatusUpdateEmail, sendOverrideNotificationEmail } from "./email.service.js";
import { createActivityLogService } from "./activity.service.js";

interface UpdateComplaintData {
  status?: string;
  operator?: string;
  resolvedAt?: Date | null;
  closedAt?: Date | null;
}

export async function updateComplaintService(
  complaintId: string,
  updateData: UpdateComplaintData,
  userRole: string,
  userId: string
) {
  // Using any to bypass type mismatch between Zod schema and MongoDB ObjectId references
  const complaint: any = await ComplaintModel.findById(complaintId).lean();
  
  if (!complaint) {
    throw new ApiError(404, "Complaint not found");
  }

  // Permission check
  // Department can always override status
  // Operator can only update if they are assigned to this complaint
  if (userRole === "operator") {
    // Check if operator is assigned to this complaint
    const operatorId = complaint.operator as mongoose.Types.ObjectId | null;
    if (!operatorId || operatorId.toString() !== userId) {
      throw new ApiError(403, "You are not assigned to this complaint");
    }
  } else if (userRole === "department") {
    // Department can override any status - no restriction
    // This gives department the power to override operator's status
  } else if (userRole === "citizen") {
    // Citizens can only mark as resolved if it's already resolved by operator
    if ((complaint.status as string) !== "resolved") {
      throw new ApiError(403, "Only assigned operator or department can update status");
    }
  } else if (userRole === "admin") {
    // Admin has full access
  } else {
    throw new ApiError(403, "Unauthorized to update complaint");
  }

  // Prepare update object
  const updateFields: any = {};
  
  if (updateData.status) {
    updateFields.status = updateData.status;
    
    // Auto-update timestamps based on status
    const resolvedAt = complaint.resolvedAt as Date | null;
    const closedAt = complaint.closedAt as Date | null;
    
    if (updateData.status === "resolved" && !resolvedAt) {
      updateFields.resolvedAt = new Date();
    }
    if (updateData.status === "closed" && !closedAt) {
      updateFields.closedAt = new Date();
    }
  }

  if (updateData.operator) {
    updateFields.operator = updateData.operator;
  }

  const updatedComplaint = await ComplaintModel.findByIdAndUpdate(
    complaintId,
    { $set: updateFields },
    { new: true }
  );

  // Log activity for status change
  if (updateData.status) {
    await createActivityLogService(
      userId,
      `Complaint ${complaintId} status updated from ${complaint.status} to ${updateData.status}`
    ).catch(err => console.error("Failed to log activity:", err));
  }

  // Log activity for operator assignment
  if (updateData.operator) {
    const operatorUser = await UserModel.findById(updateData.operator).select("fullname");
    await createActivityLogService(
      userId,
      `Operator ${(operatorUser as any)?.fullname || 'Unknown'} assigned to complaint ${complaintId}`
    ).catch(err => console.error("Failed to log activity:", err));
  }

  // Email notification logic (non-recursive - only one level up)
  if (updateData.status && complaint.status !== updateData.status) {
    const oldStatus = complaint.status as string;
    const newStatus = updateData.status;

    // Get user details who made the update
    const updatingUser = await UserModel.findById(userId).select("fullname");
    const updatingUserName = (updatingUser as any)?.fullname || "Unknown User";

    let shouldSendEmail = false;
    let recipientEmail = "";
    let recipientName = "";
    let isOverride = false;

    // Determine if email should be sent based on role and action
    if (userRole === "operator") {
      // Operator updates → notify Department
      shouldSendEmail = true;
      
      // Find department user for this complaint's department
      const departmentUser = await UserModel.findOne({
        role: "department",
        department: complaint.department,
      }).select("email fullname");

      if (departmentUser) {
        recipientEmail = (departmentUser as any).email || "";
        recipientName = (departmentUser as any).fullname || "Department User";
      }
    } else if (userRole === "department") {
      // Department updates → notify Admin of SAME department
      shouldSendEmail = true;
      
      // Find admin of this specific department
      const adminUser = await UserModel.findOne({ 
        role: "admin",
        department: complaint.department // Match complaint's department
      }).select("email fullname");
      
      if (adminUser) {
        recipientEmail = (adminUser as any).email || "";
        recipientName = (adminUser as any).fullname || "Admin User";
      } else {
        // Fallback to any admin if department-specific not found
        const fallbackAdmin = await UserModel.findOne({ role: "admin" }).select("email fullname");
        if (fallbackAdmin) {
          recipientEmail = (fallbackAdmin as any).email || "";
          recipientName = (fallbackAdmin as any).fullname || "Admin User";
        }
      }

      // Check if this is an override (department changing operator's work)
      if (complaint.operator && complaint.operator.toString() !== userId) {
        isOverride = true;
      }
    }

    // Send email notification
    if (shouldSendEmail && recipientEmail) {
      if (isOverride) {
        // Send override notification to admin
        sendOverrideNotificationEmail({
          recipientEmail,
          recipientName,
          complaintId: complaint._id.toString(),
          complaintTitle: complaint.title || "Untitled Complaint",
          originalStatus: oldStatus,
          overriddenStatus: newStatus,
          overriddenBy: updatingUserName,
        }).catch((error) => {
          console.error("Failed to send override notification email:", error);
        });
      } else {
        // Send regular status update notification
        sendStatusUpdateEmail({
          recipientEmail,
          recipientName,
          complaintId: complaint._id.toString(),
          complaintTitle: complaint.title || "Untitled Complaint",
          oldStatus,
          newStatus,
          updatedBy: updatingUserName,
          updatedByRole: userRole.charAt(0).toUpperCase() + userRole.slice(1),
        }).catch((error) => {
          console.error("Failed to send status update email:", error);
        });
      }
    }
  }

  return updatedComplaint?.toObject();
}
