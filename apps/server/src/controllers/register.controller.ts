import { registerUserService } from "../services/user.register.service.js";
import { UserModel } from "../model/user.model.js";
import { Request, Response } from "express";
import { asyncHandler } from "@civic-pulse/utils";
import { UserSchema } from "@civic-pulse/schemas";
import { ApiResponse } from "@civic-pulse/utils";
import { ApiError } from "@civic-pulse/utils";

export const registerUserController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const parsedBody = UserSchema.omit({ department: true }).safeParse(req.body);
  if (!parsedBody.success) {
    throw new ApiError(400, "Invalid request body", false);
  }
  const userData = parsedBody.data;
  if (!req.user?.role){
    throw new ApiError(403, "User role not found", false);
  }

  const { user, accessToken } = await registerUserService(userData, userId, req.user?.role);
  res.status(201).json(new ApiResponse({ user, accessToken }, "User registered successfully", 201));
});
