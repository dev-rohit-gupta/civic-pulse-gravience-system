import { ComplaintModel } from "../model/complaint.model.js";
import { UserModel } from "../model/user.model.js";
import { ApiError } from "@civic-pulse/utils";
import mongoose from "mongoose";

/**
 * Get dashboard statistics with role-based filtering
 */
export async function getDashboardStatsService(
  userRole: string,
  userId: string
) {
  const currentUser = await UserModel.findById(userId).select("department");
  
  if (!currentUser) {
    throw new ApiError(404, "User not found");
  }

  let complaintQuery: any = {};
  let operatorQuery: any = { role: "operator" };

  // Role-based filtering
  if (userRole === "citizen") {
    complaintQuery.citizen = new mongoose.Types.ObjectId(userId);
    operatorQuery = { _id: null }; // Citizens don't see operators
  } else if (userRole === "operator") {
    complaintQuery.operator = new mongoose.Types.ObjectId(userId);
    operatorQuery.department = (currentUser as any).department;
  } else if (userRole === "department") {
    complaintQuery.department = (currentUser as any).department;
    operatorQuery.department = (currentUser as any).department;
  } else if (userRole === "admin") {
    // Admin sees data from their department only
    complaintQuery.department = (currentUser as any).department;
    operatorQuery.department = (currentUser as any).department;
  }

  // Fetch complaints
  const complaints = await ComplaintModel.find(complaintQuery).lean();
  const operators = await UserModel.find(operatorQuery).select("role").lean();

  // Calculate statistics
  const stats = {
    totalComplaints: complaints.length,
    complaintsPending: complaints.filter((c: any) => c.status === "pending").length,
    complaintsWorking: complaints.filter((c: any) => 
      c.status === "assigned" || c.status === "under_progress"
    ).length,
    complaintsResolved: complaints.filter((c: any) => c.status === "resolved").length,
    complaintsClosed: complaints.filter((c: any) => c.status === "closed").length,
    complaintsRejected: complaints.filter((c: any) => c.status === "rejected").length,
    totalOperators: operators.length,
    activeOperators: operators.length, // Can add status field to User model if needed
    
    // Priority breakdown
    highPriority: complaints.filter((c: any) => c.priorityScore >= 70).length,
    mediumPriority: complaints.filter((c: any) => c.priorityScore >= 40 && c.priorityScore < 70).length,
    lowPriority: complaints.filter((c: any) => c.priorityScore < 40).length,
    
    // Category breakdown
    categoryBreakdown: {
      Road: complaints.filter((c: any) => c.category === "Road").length,
      Water: complaints.filter((c: any) => c.category === "Water").length,
      Electricity: complaints.filter((c: any) => c.category === "Electricity").length,
      Garbage: complaints.filter((c: any) => c.category === "Garbage").length,
      Other: complaints.filter((c: any) => c.category === "Other").length,
    },
    
    // Escalation stats
    escalatedComplaints: complaints.filter((c: any) => (c.escalationLevel || 0) > 0).length,
    averageEscalationLevel: complaints.length > 0 
      ? complaints.reduce((sum: number, c: any) => sum + (c.escalationLevel || 0), 0) / complaints.length 
      : 0,
  };

  return stats;
}
