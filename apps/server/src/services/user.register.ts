import { UserModel } from "../model/user.model.js";
import { User , Department } from "@civic-pulse/schemas";


export async function registerUserService(userData : Omit<User, "department" > , userId :string) {
    // Check if user already exists
    const existingUser = await UserModel.findOne({ email: userData.email,phone: userData.phone });
    if (existingUser) {
        throw new Error("User with this email already exists");
    }

    // Assign department based on userId
    const requestedUser = await UserModel.findOne({ _id: userId });
    if (!requestedUser) {
        throw new Error("User not found");
    }
    const department = requestedUser.department;

    // Create new user
    const newUser = new UserModel({...userData,department});
    await newUser.save();

    // Generate access token
    const accessToken = newUser.generateAccessToken();

    return {
        user: newUser.toObject() as User,
        accessToken,
    };
}