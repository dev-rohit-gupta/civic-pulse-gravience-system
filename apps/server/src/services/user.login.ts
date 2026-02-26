import { UserModel } from "../model/user.model.js";
import { User } from "@civic-pulse/schemas";

export async function loginUserService(userId : string) {
    const user = await UserModel.findOne({ _id: userId })
    .select("-password -_id -__v")
    .lean();
    if (!user) {
        throw new Error("User not found");
    }
    // Generate access token
    const accessToken = user.generateAccessToken();

    return {
        user: user.toObject() as Omit<User, "password">,
        accessToken,
    };
}