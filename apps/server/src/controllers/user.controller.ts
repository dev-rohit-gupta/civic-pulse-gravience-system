import {
  getOperatorsService,
  createOperatorService,
  updateOperatorService,
  deleteOperatorService,
  getUserProfileService,
  getDepartmentAdminsService,
  createDepartmentAdminService,
  updateDepartmentAdminService,
  deleteDepartmentAdminService,
} from "../services/user.service.js";
import { Request, Response } from "express";
import { asyncHandler } from "@civic-pulse/utils";
import { ApiResponse } from "@civic-pulse/utils";
import { ApiError } from "@civic-pulse/utils";
import { z } from "zod";

const createOperatorSchema = z.object({
  fullname: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(10).max(15),
  password: z.string().min(6),
  aadhaar: z.string().length(12),
  departmentId: z.string(),
});

const updateOperatorSchema = z.object({
  fullname: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(10).max(15).optional(),
  departmentId: z.string().optional(),
});

export const getOperatorsController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const userRole = req.user?.role;

  if (!userId || !userRole) {
    throw new ApiError(401, "Unauthorized");
  }

  const searchQuery = req.query.search as string | undefined;

  const operators = await getOperatorsService(userRole, userId, searchQuery);

  return res.status(200).json(
    new ApiResponse(operators, "Operators fetched successfully", 200)
  );
});

export const createOperatorController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const userRole = req.user?.role;

  if (!userId || !userRole) {
    throw new ApiError(401, "Unauthorized");
  }

  const parsedBody = createOperatorSchema.safeParse(req.body);
  if (!parsedBody.success) {
    throw new ApiError(400, parsedBody.error.issues[0].message);
  }

  const operator = await createOperatorService(parsedBody.data, userRole, userId);

  return res.status(201).json(
    new ApiResponse(operator, "Operator created successfully", 201)
  );
});

export const updateOperatorController = asyncHandler(async (req: Request, res: Response) => {
  const operatorId = req.params.id;
  const userId = req.user?.id;
  const userRole = req.user?.role;

  if (!userId || !userRole) {
    throw new ApiError(401, "Unauthorized");
  }

  const parsedBody = updateOperatorSchema.safeParse(req.body);
  if (!parsedBody.success) {
    throw new ApiError(400, parsedBody.error.issues[0].message);
  }

  const operator = await updateOperatorService(operatorId, parsedBody.data, userRole, userId);

  return res.status(200).json(
    new ApiResponse(operator, "Operator updated successfully", 200)
  );
});

export const deleteOperatorController = asyncHandler(async (req: Request, res: Response) => {
  const operatorId = req.params.id;
  const userRole = req.user?.role;
  const userId = req.user?.id;

  if (!userRole || !userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const result = await deleteOperatorService(operatorId, userRole, userId);

  return res.status(200).json(
    new ApiResponse(result, "Operator deleted successfully", 200)
  );
});

export const getUserProfileController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const profile = await getUserProfileService(userId);

  return res.status(200).json(
    new ApiResponse(profile, "Profile fetched successfully", 200)
  );
});

// Department Admin Controllers
const createDepartmentAdminSchema = z.object({
  fullname: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(10).max(15),
  password: z.string().min(8),
  aadhaar: z.string().length(12),
  department: z.string(),
});

const updateDepartmentAdminSchema = z.object({
  fullname: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(10).max(15).optional(),
  department: z.string().optional(),
});

export const getDepartmentAdminsController = asyncHandler(async (req: Request, res: Response) => {
  const userRole = req.user?.role;

  if (!userRole) {
    throw new ApiError(401, "Unauthorized");
  }

  if (userRole !== "admin") {
    throw new ApiError(403, "Only system administrators can view department admins");
  }

  const searchQuery = req.query.search as string | undefined;

  const admins = await getDepartmentAdminsService(searchQuery);

  return res.status(200).json(
    new ApiResponse(admins, "Department admins fetched successfully", 200)
  );
});

export const createDepartmentAdminController = asyncHandler(async (req: Request, res: Response) => {
  const userRole = req.user?.role;

  if (!userRole) {
    throw new ApiError(401, "Unauthorized");
  }

  if (userRole !== "admin") {
    throw new ApiError(403, "Only system administrators can create department admins");
  }

  const parsedBody = createDepartmentAdminSchema.safeParse(req.body);
  if (!parsedBody.success) {
    throw new ApiError(400, parsedBody.error.issues[0].message);
  }

  const admin = await createDepartmentAdminService(parsedBody.data);

  return res.status(201).json(
    new ApiResponse(admin, "Department admin created successfully", 201)
  );
});

export const updateDepartmentAdminController = asyncHandler(async (req: Request, res: Response) => {
  const adminId = req.params.id;
  const userRole = req.user?.role;

  if (!userRole) {
    throw new ApiError(401, "Unauthorized");
  }

  if (userRole !== "admin") {
    throw new ApiError(403, "Only system administrators can update department admins");
  }

  const parsedBody = updateDepartmentAdminSchema.safeParse(req.body);
  if (!parsedBody.success) {
    throw new ApiError(400, parsedBody.error.issues[0].message);
  }

  const admin = await updateDepartmentAdminService(adminId, parsedBody.data);

  return res.status(200).json(
    new ApiResponse(admin, "Department admin updated successfully", 200)
  );
});

export const deleteDepartmentAdminController = asyncHandler(async (req: Request, res: Response) => {
  const adminId = req.params.id;
  const userRole = req.user?.role;

  if (!userRole) {
    throw new ApiError(401, "Unauthorized");
  }

  if (userRole !== "admin") {
    throw new ApiError(403, "Only system administrators can delete department admins");
  }

  const result = await deleteDepartmentAdminService(adminId);

  return res.status(200).json(
    new ApiResponse(result, "Department admin deleted successfully", 200)
  );
});

