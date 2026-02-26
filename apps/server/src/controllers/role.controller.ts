import { Request, Response } from "express";
import { asyncHandler } from "@civic-pulse/utils";
import { ApiResponse } from "@civic-pulse/utils";
import { ApiError } from "@civic-pulse/utils";
import { SystemRoleSchema } from "@civic-pulse/schemas";
import {
  getRolesService,
  getRoleByIdService,
  createRoleService,
  updateRoleService,
  deleteRoleService,
} from "../services/role.service.js";

// Schema for creating a role
const createRoleBodySchema = SystemRoleSchema.pick({
  name: true,
  description: true,
  permissions: true,
  isActive: true,
}).partial({ description: true, permissions: true, isActive: true });

// Schema for updating a role (all fields optional)
const updateRoleBodySchema = SystemRoleSchema.pick({
  name: true,
  description: true,
  permissions: true,
  isActive: true,
}).partial();

// GET /api/role - Get all roles
export const getAllRolesController = asyncHandler(async (req: Request, res: Response) => {
  const roles = await getRolesService();
  return res.status(200).json(new ApiResponse(roles, "Roles fetched successfully", 200));
});

// GET /api/role/:id - Get a single role by id
export const getRoleByIdController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ApiError(400, "Role ID is required");
  }
  
  const role = await getRoleByIdService(id);
  return res.status(200).json(new ApiResponse(role, "Role fetched successfully", 200));
});

// POST /api/role/create - Create a new role
export const createRoleController = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, permissions, isActive } = createRoleBodySchema.parse(req.body);
  
  const id = `role-${crypto.randomUUID()}`;
  
  const role = await createRoleService({
    id,
    name,
    description: description || null,
    permissions: permissions || [],
    isActive: isActive ?? true,
  });
  
  return res.status(201).json(new ApiResponse(role, "Role created successfully", 201));
});

// PUT /api/role/:id - Update a role
export const updateRoleController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ApiError(400, "Role ID is required");
  }
  
  const updateData = updateRoleBodySchema.parse(req.body);
  
  if (Object.keys(updateData).length === 0) {
    throw new ApiError(400, "At least one field is required to update");
  }
  
  const updatedRole = await updateRoleService({ id }, updateData);
  
  return res.status(200).json(new ApiResponse(updatedRole, "Role updated successfully", 200));
});

// DELETE /api/role/:id - Delete a role
export const deleteRoleController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ApiError(400, "Role ID is required");
  }
  
  const deletedRole = await deleteRoleService({ id });
  
  return res.status(200).json(new ApiResponse(deletedRole, "Role deleted successfully", 200));
});
