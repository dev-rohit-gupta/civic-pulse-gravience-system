import express from "express";
import {
  getAllCategoriesController,
  getCategoryByIdController,
  createCategoryController,
  updateCategoryController,
  deleteCategoryController,
} from "../controllers/category.controller.js";

const category_routes = express.Router();

// GET /api/category - Get all categories
category_routes.get("/", getAllCategoriesController);

// GET /api/category/:id - Get a single category by id
category_routes.get("/:id", getCategoryByIdController);

// POST /api/category/create - Create a new category
category_routes.post("/create", createCategoryController);

// PUT /api/category/:id - Update a category
category_routes.put("/:id", updateCategoryController);

// DELETE /api/category/:id - Delete a category
category_routes.delete("/:id", deleteCategoryController);

export default category_routes;
