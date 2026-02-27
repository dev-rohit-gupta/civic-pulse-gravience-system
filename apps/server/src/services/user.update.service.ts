import { UserModel } from "../model/user.model.js";
import { User } from "@civic-pulse/schemas";
import { deepMerge } from "@civic-pulse/utils";

export async function updateUserService(
  userId: string,
  updateData: Partial<Omit<User, "password">>
) {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const updatedUserData = deepMerge<User>(user.toObject(), updateData);
  const updatedUser = await UserModel.findByIdAndUpdate(userId, updatedUserData, { new: true })
    .select("-password   -__v")
    .lean();

  return updatedUser;
}
