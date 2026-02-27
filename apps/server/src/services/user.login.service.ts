import { UserModel } from "../model/user.model.js";
import { User } from "@civic-pulse/schemas";

export async function loginUserService(email: string, password: string) {
    const user = await UserModel.findOne({ email : email })
    .select("-__v") // Exclude only __v, keep _id for token generation
    
    if (!user) {
        console.error(`Login failed: No user found with email ${email}`);
        throw new Error("User not found");
    }
    // Check if password is correct
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        throw new Error("Invalid password");
    }

    // Generate access token
    const accessToken = await user.generateAccessToken();

    // Remove password from user object before returning
    const { password: _, ...userWithoutPassword } = user.toObject();

    return {
        user: userWithoutPassword as Omit<User, "password">,
        accessToken,
    };
}