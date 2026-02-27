import { ActivityLogModel } from "../model/activity.model.js";
import { UserModel } from "../model/user.model.js";
import { ComplaintModel } from "../model/complaint.model.js";
import { ApiError } from "@civic-pulse/utils";
import mongoose from "mongoose";

/**
 * Get activity logs with role-based filtering
 */
export async function getActivityLogsService(
  userRole: string,
  userId: string,
  filters?: {
    limit?: number;
    skip?: number;
  }
) {
  const currentUser = await UserModel.findById(userId).select("department fullname");
  
  if (!currentUser) {
    throw new ApiError(401, "Invalid session");
  }

  let activityLogs: any[] = [];
  const limit = filters?.limit || 50;
  const skip = filters?.skip || 0;

  // Fetch all activity logs first
  const allLogs = await ActivityLogModel.find()
    .populate("user", "fullname role email")
    .sort({ performedData: -1 })
    .limit(limit)
    .skip(skip)
    .lean();

  if (userRole === "citizen") {
    // Citizens see only activities related to their complaints
    const userComplaints = await ComplaintModel.find({ 
      citizen: new mongoose.Types.ObjectId(userId) 
    }).select("_id title").lean() || [];
    
    const complaintIds = userComplaints.map(c => c._id.toString());
    const complaintTitles = userComplaints.map(c => (c as any).title);

    activityLogs = allLogs.filter((log: any) => {
      const activityText = log.activity?.toLowerCase() || "";
      // Check if activity mentions any of the user's complaint IDs or titles
      return complaintIds.some(id => activityText.includes(id)) ||
             complaintTitles.some(title => activityText.includes(title.toLowerCase())) ||
             activityText.includes((currentUser as any).fullname.toLowerCase());
    });
  } else if (userRole === "operator") {
    // Operators see activities related to their assigned complaints and their own actions
    const assignedComplaints = await ComplaintModel.find({ 
      operator: new mongoose.Types.ObjectId(userId) 
    }).select("_id title").lean();
    
    const complaintIds = assignedComplaints.map(c => c._id.toString());
    const complaintTitles = assignedComplaints.map(c => (c as any).title);

    activityLogs = allLogs.filter((log: any) => {
      const activityText = log.activity?.toLowerCase() || "";
      const logUserId = log.user?._id?.toString();
      
      return logUserId === userId ||
             complaintIds.some(id => activityText.includes(id)) ||
             complaintTitles.some(title => activityText.includes(title.toLowerCase())) ||
             activityText.includes((currentUser as any).fullname.toLowerCase());
    });
  } else if (userRole === "department" || userRole === "admin") {
    // Department and Admin see activities related to their department's complaints
    const deptComplaints = await ComplaintModel.find({ 
      department: (currentUser as any).department 
    }).select("_id title").lean();
    
    const complaintIds = deptComplaints.map(c => c._id.toString());
    const complaintTitles = deptComplaints.map(c => (c as any).title);
    
    activityLogs = allLogs.filter((log: any) => {
      const activityText = log.activity?.toLowerCase() || "";
      
      return complaintIds.some(id => activityText.includes(id)) ||
             complaintTitles.some(title => activityText.includes(title.toLowerCase()));
    });
  }

  return activityLogs;
}

/**
 * Create activity log entry (helper function for auto-logging)
 */
export async function createActivityLogService(
  userId: string,
  activityDescription: string
) {
  const newActivity = await ActivityLogModel.create({
    user: new mongoose.Types.ObjectId(userId),
    activity: activityDescription,
    performedData: new Date(),
  });

  const populatedActivity = await ActivityLogModel.findById(newActivity._id)
    .populate("user", "fullname role email")
    .lean();

  return populatedActivity;
}
