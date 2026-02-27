import { Router } from "express";
import { 
  registerComplaintController, 
  getAllComplaintsController, 
  getComplaintDetailsController,
  deleteComplaintController 
} from "../controllers/complaint.controller.js";
import { updateComplaintController, assignOperatorController } from "../controllers/complaint.update.controller.js";
import { escalateComplaintController, getEscalationHistoryController } from "../controllers/complaint.escalate.controller.js";
import { uploader } from "../middleware/multer.middleware.js";
import { requireAuth } from "../middleware/auth.middleware.js";

export const complaintRouter = Router();

// Get all complaints (role-based filtering)
complaintRouter.get("/", requireAuth, getAllComplaintsController);

// Get single complaint details
complaintRouter.get("/:id", requireAuth, getComplaintDetailsController);

// Register new complaint
complaintRouter.post("/register", requireAuth, uploader.single("file"), registerComplaintController);

// Update complaint status - Department can override operator's status
complaintRouter.patch("/:id", requireAuth, updateComplaintController);

// Assign operator to complaint - Only department/admin
complaintRouter.patch("/:id/assign", requireAuth, assignOperatorController);

// Delete complaint (admin only)
complaintRouter.delete("/:id", requireAuth, deleteComplaintController);

// Escalate complaint to next level in hierarchy
complaintRouter.post("/:id/escalate", requireAuth, escalateComplaintController);

// Get escalation history
complaintRouter.get("/:id/escalation-history", requireAuth, getEscalationHistoryController);

