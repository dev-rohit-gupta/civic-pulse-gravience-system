import { Router } from "express";
import { 
  registerPublicComplaintController,
  trackPublicComplaintController,
  searchPublicComplaintsController
} from "../controllers/public-complaint.controller.js";

export const publicComplaintRouter = Router();

// Public complaint registration (no auth required)
publicComplaintRouter.post("/register", registerPublicComplaintController);

// Track complaint by reference ID (no auth required)
publicComplaintRouter.get("/track/:complaintId", trackPublicComplaintController);

// Search public complaints (no auth required)
publicComplaintRouter.get("/search", searchPublicComplaintsController);
