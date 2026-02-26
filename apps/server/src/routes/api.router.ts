import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { complaintRouter } from "./complaint.route.js";


export const apiRouter = Router();

apiRouter.use("/", authRouter);
apiRouter.use("/complaint", complaintRouter);