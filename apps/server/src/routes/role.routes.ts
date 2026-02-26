import express from "express";
import {
  getAllRolesController,
  getRoleByIdController,
  createRoleController,
  updateRoleController,
  deleteRoleController,
} from "../controllers/role.controller.js";

const role_routes = express.Router();

// GET /api/role - Get all roles
role_routes.get("/", getAllRolesController);

// GET /api/role/:id - Get a single role by id
role_routes.get("/:id", getRoleByIdController);

// POST /api/role/create - Create a new role
role_routes.post("/create", createRoleController);

// PUT /api/role/:id - Update a role
role_routes.put("/:id", updateRoleController);

// DELETE /api/role/:id - Delete a role
role_routes.delete("/:id", deleteRoleController);

export default role_routes;
