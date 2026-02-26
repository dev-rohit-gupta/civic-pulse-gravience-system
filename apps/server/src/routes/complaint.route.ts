import { Router } from "express";
import { registerComplaintController } from "../controllers/complaint.controller.js";
import { uploader } from "../middleware/multer.middleware.js";

export const complaintRouter = Router();

complaintRouter.post("/register", uploader.single("file"), registerComplaintController);

