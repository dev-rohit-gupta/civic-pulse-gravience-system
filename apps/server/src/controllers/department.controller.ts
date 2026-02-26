import { Request, Response } from "express";
import { asyncHandler } from "@civic-pulse/utils";
import { ApiResponse } from "@civic-pulse/utils";
import { ApiError } from "@civic-pulse/utils";
import { DepartmentSchema } from "@civic-pulse/schemas";
import { 
  getDepartmentsService, 
  createDepartmentService, 
  updateDepartmentService, 
  deleteDepartmentService 
} from "../services/department.service.js";
import { generateDepartmentId } from "@civic-pulse/utils";

// Schema for creating a department
const createDepartmentBodySchema = DepartmentSchema.pick({
  title: true,
  description: true,
  category: true,
});

// Schema for updating a department (all fields optional)
const updateDepartmentBodySchema = DepartmentSchema.pick({
  title: true,
  description: true,
  category: true,
}).partial();

// GET /api/department - Get all departments
export const getAllDepartmentsController = asyncHandler(async (req: Request, res: Response) => {
  const departments = await getDepartmentsService();
  return res.status(200).json(new ApiResponse(departments, "Departments fetched successfully", 200));
});

// POST /api/department/create - Create a new department
export const createDepartmentController = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, category } = createDepartmentBodySchema.parse(req.body);
  
  const id = generateDepartmentId();
  
  const department = await createDepartmentService({
    id,
    title,
    description: description || "",
    category,
  });
  
  return res.status(201).json(new ApiResponse(department, "Department created successfully", 201));
});

// PUT /api/department/:id - Update a department
export const updateDepartmentController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ApiError(400, "Department ID is required");
  }
  
  const updateData = updateDepartmentBodySchema.parse(req.body);
  
  if (Object.keys(updateData).length === 0) {
    throw new ApiError(400, "At least one field is required to update");
  }
  
  // Convert null to undefined for the service
  const serviceUpdateData = {
    ...updateData,
    description: updateData.description === null ? undefined : updateData.description,
  };
  
  const updatedDepartment = await updateDepartmentService({ id }, serviceUpdateData);
  
  return res.status(200).json(new ApiResponse(updatedDepartment, "Department updated successfully", 200));
});

// DELETE /api/department/:id - Delete a department
export const deleteDepartmentController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ApiError(400, "Department ID is required");
  }
  
  const deletedDepartment = await deleteDepartmentService({ id });
  
  return res.status(200).json(new ApiResponse(deletedDepartment, "Department deleted successfully", 200));
});

