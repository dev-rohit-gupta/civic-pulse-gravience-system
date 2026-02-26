import { UserModel } from "../model/user.model.js";
import { User, Department } from "@civic-pulse/schemas";
import { DepartmentModel } from "../model/department.model.js";

type userDataT = Omit<User, "department" | "role"> & {
  department?: string;
};

export async function registerUserService(userData: userDataT, userId: string, role: User["role"]) {
  // Check if user already exists
  const existingUser = await UserModel.findOne({ email: userData.email, phone: userData.phone });
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

    let newUser ;
    switch (role) {
      case "department":
        newUser = await registerDepartmentUser(userData);
        break;
      case "operator":
        newUser = await registerOperator(userData, userId);
        break;
      case "citizen":
        newUser = await registerCitizen(userData);
        break;
      case "admin":
        newUser = await registerAdmin(userData);
        break;
      default:
        throw new Error("Invalid role"); 
    }

  // Generate access token
  const accessToken = newUser.generateAccessToken();

  return {
    user: newUser.toObject() as User,
    accessToken,
  };
}

async function registerDepartmentUser(userData: userDataT) {
  const department = await DepartmentModel.exists({ id: userData.department });
  if (!department) {
    throw new Error("Department not found");
  }
  const newDepartmentUser = new UserModel({ ...userData, department: department._id, role: "department" });
  await newDepartmentUser.save();
  return newDepartmentUser;
}
async function registerOperator(userData : userDataT, userId : string) {
    const existingUser = await UserModel.exists({ email: userData.email, phone: userData.phone });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const department = await UserModel.findOne({ _id: userId }).select("department");
    if (!department) {
      throw new Error("Department not found");
    }

    const newOperator = new UserModel({ ...userData, department: department._id, role: "operator" });
    await newOperator.save();
    return newOperator;
}

async function registerCitizen(userData : userDataT) {
    const existingUser = await UserModel.exists({ email: userData.email, phone: userData.phone });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const newCitizen = new UserModel({ ...userData, department: null, role: "citizen" });
    await newCitizen.save();
    return newCitizen;
}

async function registerAdmin(userData : userDataT) {
    const existingUser = await UserModel.exists({ email: userData.email, phone: userData.phone });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const newAdmin = new UserModel({ ...userData, department: null, role: "admin" });
    await newAdmin.save();
    return newAdmin;
}