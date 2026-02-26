import { Router } from "express";
import { registerComplaintController } from "../controllers/complaint.controller.js";
import { updateComplaintController, assignOperatorController } from "../controllers/complaint.update.controller.js";
import { escalateComplaintController, getEscalationHistoryController } from "../controllers/complaint.escalate.controller.js";
import { uploader } from "../middleware/multer.middleware.js";
import { requireAuth } from "../middleware/auth.middleware.js";

export const complaintRouter = Router();

complaintRouter.post("/register", uploader.single("file"), registerComplaintController);

// Update complaint status - Department can override operator's status
complaintRouter.patch("/:id", requireAuth, updateComplaintController);

// Assign operator to complaint - Only department/admin
complaintRouter.patch("/:id/assign", requireAuth, assignOperatorController);

// Escalate complaint to next level in hierarchy
complaintRouter.post("/:id/escalate", requireAuth, escalateComplaintController);

// Get escalation history
complaintRouter.get("/:id/escalation-history", requireAuth, getEscalationHistoryController);

