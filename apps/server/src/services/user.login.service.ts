import { UserModel } from "../model/user.model.js";
import { User } from "@civic-pulse/schemas";

export async function loginUserService(email: string, password: string) {
    const user = await UserModel.findOne({ email })
    .select("-password -_id -__v")
    
    if (!user) {
        throw new Error("User not found");
    }
    // Check if password is correct
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        throw new Error("Invalid password");
    }

    // Generate access token
    const accessToken = await user.generateAccessToken();

    return {
        user: user.toObject() as Omit<User, "password">,
        accessToken,
    };
}