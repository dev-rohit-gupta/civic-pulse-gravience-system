import { Router } from "express";
import {
  getOperatorsController,
  createOperatorController,
  updateOperatorController,
  deleteOperatorController,
  getUserProfileController,
  getDepartmentAdminsController,
  createDepartmentAdminController,
  updateDepartmentAdminController,
  deleteDepartmentAdminController,
} from "../controllers/user.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

export const userRouter = Router();

// Get current user profile
userRouter.get("/profile", requireAuth, getUserProfileController);

// Get all operators (role-based filtering)
userRouter.get("/operators", requireAuth, getOperatorsController);

// Create new operator (admin/department only)
userRouter.post("/operator", requireAuth, createOperatorController);

// Update operator (admin/department only)
userRouter.patch("/operator/:id", requireAuth, updateOperatorController);

// Delete operator (admin only)
userRouter.delete("/operator/:id", requireAuth, deleteOperatorController);

// Department Admin routes (admin only)
userRouter.get("/department-admins", requireAuth, getDepartmentAdminsController);
userRouter.post("/department-admin", requireAuth, createDepartmentAdminController);
userRouter.patch("/department-admin/:id", requireAuth, updateDepartmentAdminController);
userRouter.delete("/department-admin/:id", requireAuth, deleteDepartmentAdminController);

