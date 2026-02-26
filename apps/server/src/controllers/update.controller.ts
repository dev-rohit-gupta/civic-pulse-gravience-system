import { registerUserService } from "../services/user.register.service.js";
import { UserModel } from "../model/user.model.js";
import { Request, Response } from "express";
import { asyncHandler } from "@civic-pulse/utils";
import { UserSchema } from "@civic-pulse/schemas";
import { ApiResponse } from "@civic-pulse/utils";
import { ApiError } from "@civic-pulse/utils";


export async function updateUserController() {
    
}