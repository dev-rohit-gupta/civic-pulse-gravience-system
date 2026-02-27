import { UserModel } from "../model/user.model.js";
import { ApiError } from "@civic-pulse/utils";
import mongoose from "mongoose";
import { generateUserId } from "@civic-pulse/utils";
import bcrypt from "bcrypt";
import { createActivityLogService } from "./activity.service.js";

/**
 * Get all operators with role-based filtering
 */
export async function getOperatorsService(
  userRole: string,
  userId: string,
  searchQuery?: string
) {
  const currentUser = await UserModel.findById(userId).select("department");
  
  if (!currentUser) {
    throw new ApiError(404, "User not found");
  }

  let query: any = { role: "operator" };

  // Role-based filtering
  if (userRole === "citizen") {
    // Citizens cannot view operators
    return [];
  } else if (userRole === "operator" || userRole === "department") {
    // Operators and department see only their department's operators
    query.department = (currentUser as any).department;
  } else if (userRole === "admin") {
    // Admin sees only their department's operators
    query.department = (currentUser as any).department;
  }

  const operators = await UserModel.find(query)
    .select("-password -aadhaar")
    .populate("department", "title category")
    .sort({ fullname: 1 })
    .lean();

  // Apply search filter if provided
  let filteredOperators = operators;
  if (searchQuery) {
    const searchLower = searchQuery.toLowerCase();
    filteredOperators = operators.filter((op: any) => 
      op.fullname?.toLowerCase().includes(searchLower) ||
      op.email?.toLowerCase().includes(searchLower) ||
      op.phone?.includes(searchLower) ||
      op.department?.title?.toLowerCase().includes(searchLower)
    );
  }

  return filteredOperators;
}

/**
 * Create new operator (admin/department only)
 */
export async function createOperatorService(
  operatorData: {
    fullname: string;
    email: string;
    phone: string;
    password: string;
    aadhaar: string;
    departmentId: string;
  },
  userRole: string,
  userId: string
) {
  // Permission check
  if (userRole !== "admin" && userRole !== "department") {
    throw new ApiError(403, "Only admin or department can create operators");
  }

  // Check if email already exists
  const existingUser = await UserModel.findOne({ email: operatorData.email });
  if (existingUser) {
    throw new ApiError(400, "Email already registered");
  }

  // For department role, ensure they can only create operators in their own department
  if (userRole === "department") {
    const departmentUser = await UserModel.findById(userId).select("department");
    if ((departmentUser as any)?.department?.toString() !== operatorData.departmentId) {
      throw new ApiError(403, "You can only create operators in your own department");
    }
  }

  // Generate operator ID
  const operatorId = generateUserId();

  const newOperator = await UserModel.create({
    id: operatorId,
    fullname: operatorData.fullname,
    email: operatorData.email,
    phone: operatorData.phone,
    password: operatorData.password, // Will be hashed by pre-save middleware
    aadhaar: operatorData.aadhaar, // Will be hashed by pre-save middleware
    role: "operator",
    department: new mongoose.Types.ObjectId(operatorData.departmentId),
  });

  const populatedOperator = await UserModel.findById(newOperator._id)
    .select("-password -aadhaar")
    .populate("department", "title category");

  // Log activity
  await createActivityLogService(
    userId,
    `Operator Created: ${operatorData.fullname} - Email: ${operatorData.email}`
  ).catch(err => console.error("Failed to log activity:", err));

  return populatedOperator;
}

/**
 * Update operator details (admin/department only)
 */
export async function updateOperatorService(
  operatorId: string,
  updateData: {
    fullname?: string;
    email?: string;
    phone?: string;
    departmentId?: string;
  },
  userRole: string,
  userId: string
) {
  // Permission check
  if (userRole !== "admin" && userRole !== "department") {
    throw new ApiError(403, "Only admin or department can update operators");
  }

  const operator = await UserModel.findById(operatorId);
  if (!operator) {
    throw new ApiError(404, "Operator not found");
  }

  // Ensure it's actually an operator
  if ((operator as any).role !== "operator") {
    throw new ApiError(400, "User is not an operator");
  }

  // Department can only update operators in their department
  if (userRole === "department") {
    const departmentUser = await UserModel.findById(userId).select("department");
    if ((operator as any).department?.toString() !== (departmentUser as any)?.department?.toString()) {
      throw new ApiError(403, "You can only update operators in your department");
    }
  }

  // Update fields
  const updateFields: any = {};
  if (updateData.fullname) updateFields.fullname = updateData.fullname;
  if (updateData.email) {
    // Check if email is already taken
    const existingEmail = await UserModel.findOne({ 
      email: updateData.email, 
      _id: { $ne: operatorId } 
    });
    if (existingEmail) {
      throw new ApiError(400, "Email already in use");
    }
    updateFields.email = updateData.email;
  }
  if (updateData.phone) updateFields.phone = updateData.phone;
  if (updateData.departmentId) {
    updateFields.department = new mongoose.Types.ObjectId(updateData.departmentId);
  }

  const updatedOperator = await UserModel.findByIdAndUpdate(
    operatorId,
    { $set: updateFields },
    { new: true }
  )
    .select("-password -aadhaar")
    .populate("department", "title category");

  // Log activity
  await createActivityLogService(
    userId,
    `Operator Updated: ${(updatedOperator as any)?.fullname} - ID: ${operatorId}`
  ).catch(err => console.error("Failed to log activity:", err));

  return updatedOperator;
}

/**
 * Delete operator (admin only)
 */
export async function deleteOperatorService(
  operatorId: string,
  userRole: string,
  userId: string
) {
  if (userRole !== "admin") {
    throw new ApiError(403, "Only administrators can delete operators");
  }

  const operator = await UserModel.findById(operatorId);
  if (!operator) {
    throw new ApiError(404, "Operator not found");
  }

  // Ensure it's actually an operator
  if ((operator as any).role !== "operator") {
    throw new ApiError(400, "User is not an operator");
  }

  // Verify admin can only delete operators from their department
  const adminUser = await UserModel.findById(userId).select("department");
  if ((adminUser as any)?.department?.toString() !== (operator as any).department?.toString()) {
    throw new ApiError(403, "You can only delete operators from your department");
  }

  await UserModel.findByIdAndDelete(operatorId);

  // Log activity
  await createActivityLogService(
    userId,
    `Operator Deleted: ${(operator as any)?.fullname} - ID: ${operatorId}`
  ).catch(err => console.error("Failed to log activity:", err));

  return { deleted: true, operatorId };
}

/**
 * Get current user profile
 */
export async function getUserProfileService(userId: string) {
  const user = await UserModel.findById(userId)
    .select("-password -aadhaar")
    .populate("department", "title category description")
    .lean();

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
}
