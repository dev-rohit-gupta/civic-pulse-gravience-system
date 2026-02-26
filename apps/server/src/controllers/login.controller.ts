import { loginUserService } from "../services/user.login.js";
import { Request, Response } from "express";
import { asyncHandler } from "@civic-pulse/utils";
import { UserSchema } from "@civic-pulse/schemas";

export const loginUserController = asyncHandler(
  async (req: Request, res: Response) => {
    
    const parsedBody = UserSchema
    .omit({ department: true, role: true })
    .parse(req.body);
    
  }
);