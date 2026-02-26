import express from 'express';
import { 
  getAllDepartmentsController, 
  createDepartmentController, 
  updateDepartmentController, 
  deleteDepartmentController 
} from '../controllers/department.controller.js';

const department_routes = express.Router();

// GET /api/department - Get all departments
department_routes.get("/", getAllDepartmentsController);

// POST /api/department/create - Create a new department
department_routes.post("/create", createDepartmentController);

// PUT /api/department/:id - Update a department
department_routes.put("/:id", updateDepartmentController);

// DELETE /api/department/:id - Delete a department
department_routes.delete("/:id", deleteDepartmentController);

export default department_routes;