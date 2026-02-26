import { Request, Response } from "express";
import { asyncHandler } from "@civic-pulse/utils";
import { ApiResponse } from "@civic-pulse/utils";
import { ApiError } from "@civic-pulse/utils";
import { CategorySchema } from "@civic-pulse/schemas";
import {
  getCategoriesService,
  getCategoryByIdService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
} from "../services/category.service.js";

// Schema for creating a category
const createCategoryBodySchema = CategorySchema.pick({
  name: true,
  description: true,
  icon: true,
  isActive: true,
}).partial({ description: true, icon: true, isActive: true });

// Schema for updating a category (all fields optional)
const updateCategoryBodySchema = CategorySchema.pick({
  name: true,
  description: true,
  icon: true,
  isActive: true,
}).partial();

// GET /api/category - Get all categories
export const getAllCategoriesController = asyncHandler(async (req: Request, res: Response) => {
  const categories = await getCategoriesService();
  return res.status(200).json(new ApiResponse(categories, "Categories fetched successfully", 200));
});

// GET /api/category/:id - Get a single category by id
export const getCategoryByIdController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ApiError(400, "Category ID is required");
  }
  
  const category = await getCategoryByIdService(id);
  return res.status(200).json(new ApiResponse(category, "Category fetched successfully", 200));
});

// POST /api/category/create - Create a new category
export const createCategoryController = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, icon, isActive } = createCategoryBodySchema.parse(req.body);
  
  const id = `category-${crypto.randomUUID()}`;
  
  const category = await createCategoryService({
    id,
    name,
    description: description || null,
    icon: icon || null,
    isActive: isActive ?? true,
  });
  
  return res.status(201).json(new ApiResponse(category, "Category created successfully", 201));
});

// PUT /api/category/:id - Update a category
export const updateCategoryController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ApiError(400, "Category ID is required");
  }
  
  const updateData = updateCategoryBodySchema.parse(req.body);
  
  if (Object.keys(updateData).length === 0) {
    throw new ApiError(400, "At least one field is required to update");
  }
  
  const updatedCategory = await updateCategoryService({ id }, updateData);
  
  return res.status(200).json(new ApiResponse(updatedCategory, "Category updated successfully", 200));
});

// DELETE /api/category/:id - Delete a category
export const deleteCategoryController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ApiError(400, "Category ID is required");
  }
  
  const deletedCategory = await deleteCategoryService({ id });
  
  return res.status(200).json(new ApiResponse(deletedCategory, "Category deleted successfully", 200));
});
