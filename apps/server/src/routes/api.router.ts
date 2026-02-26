import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { complaintRouter } from "./complaint.route.js";
import department_routes from "./department.routes.js";
import category_routes from "./category.routes.js";
import role_routes from "./role.routes.js";


export const apiRouter = Router();

apiRouter.use("/", authRouter);
apiRouter.use("/complaint", complaintRouter);
apiRouter.use("/department", department_routes);
apiRouter.use("/category", category_routes);
apiRouter.use("/role", role_routes);