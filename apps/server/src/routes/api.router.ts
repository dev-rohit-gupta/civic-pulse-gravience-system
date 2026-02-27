import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { complaintRouter } from "./complaint.route.js";
import { publicComplaintRouter } from "./public-complaint.routes.js";
import department_routes from "./department.routes.js";
import category_routes from "./category.routes.js";
import role_routes from "./role.routes.js";
import { userRouter } from "./user.routes.js";
import { activityRouter } from "./activity.routes.js";
import { dashboardRouter } from "./dashboard.routes.js";
import { requireAuth } from "../middleware/auth.middleware.js";


export const apiRouter = Router();

// Public routes (no authentication required)
apiRouter.use("/public/complaint", publicComplaintRouter);

// Authentication routes
apiRouter.use("/", authRouter);

// Protected routes (require authentication)
apiRouter.use("/complaint", requireAuth, complaintRouter);
apiRouter.use("/department", requireAuth, department_routes);
apiRouter.use("/category", requireAuth, category_routes);
apiRouter.use("/role", requireAuth, role_routes);
apiRouter.use("/users", requireAuth, userRouter);
apiRouter.use("/activity", requireAuth, activityRouter);
apiRouter.use("/dashboard", dashboardRouter);