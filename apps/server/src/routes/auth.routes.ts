import { Router } from "express";
import { loginUserController } from "../controllers/login.controller.js";
import { registerUserController } from "../controllers/register.controller.js";

export const authRouter = Router();

authRouter.post("/login", loginUserController);
authRouter.post("/register", registerUserController);


