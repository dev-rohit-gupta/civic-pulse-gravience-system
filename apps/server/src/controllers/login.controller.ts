import { loginUserService } from "../services/user.login.service.js";
import { Request, Response } from "express";
import { asyncHandler } from "@civic-pulse/utils";
import { UserSchema } from "@civic-pulse/schemas";
import { ApiResponse } from "@civic-pulse/utils";
import { ApiError } from "@civic-pulse/utils";

export const loginUserController = asyncHandler(async (req: Request, res: Response) => {
  const parsedBody = UserSchema.pick({ email: true, password: true }).safeParse(req.body);
  if (!parsedBody.success) {
    throw new ApiError(400, "Invalid request body",false);
  }
  const { email, password } = parsedBody.data;
  const { user, accessToken } = await loginUserService(email, password);

  res.status(200).json(new ApiResponse({ user, accessToken }, "Login successful", 200));
});
