import { UserModel } from "../model/user.model.js";
import { User, Department } from "@civic-pulse/schemas";
import { DepartmentModel } from "../model/department.model.js";

type userDataT = Omit<User, "department" | "role"> & {
  department?: string;
};

export async function registerUserService(
  userData: userDataT, 
  userId: string, 
  role: User["role"]
) {
  // Check if user already exists (email OR phone OR aadhaar)
  const existingUser = await UserModel.findOne({ 
    $or: [
      { email: userData.email },
      { phone: userData.phone },
      { aadhaar: userData.aadhaar }
    ]
  });
  
  if (existingUser) {
    throw new Error("User with this email, phone, or aadhaar already exists");
  }

  let newUser;
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
  const accessToken = await newUser.generateAccessToken();

  return {
    user: newUser.toObject() as User,
    accessToken,
  };
}

async function registerDepartmentUser(userData: userDataT) {
  if (!userData.department) {
    throw new Error("Department ID is required for department users");
  }

  const department = await DepartmentModel.findOne({ id: userData.department });
  if (!department) {
    throw new Error("Department not found");
  }

  const newDeptUser = new UserModel({ 
    ...userData, 
    department: department._id, 
    role: "department" 
  });
  await newDeptUser.save();
  return newDeptUser;
}

async function registerOperator(userData: userDataT, userId: string) {
  // Get the department user who is creating this operator
  const departmentUser = await UserModel.findOne({ _id: userId }).select("department");
  if (!departmentUser) {
    throw new Error("Department user not found");
  }

  if (!departmentUser.department) {
    throw new Error("Department user must be associated with a department");
  }

  const newOperator = new UserModel({ 
    ...userData, 
    department: departmentUser.department, 
    role: "operator" 
  });
  await newOperator.save();
  return newOperator;
}

async function registerCitizen(userData: userDataT) {
  const newCitizen = new UserModel({ 
    ...userData, 
    department: null, 
    role: "citizen" 
  });
  await newCitizen.save();
  return newCitizen;
}

async function registerAdmin(userData: userDataT) {
  // Admin registers without department
  // Department will be assigned later via dashboard
  const newAdmin = new UserModel({ 
    ...userData, 
    department: null, // No department initially
    role: "admin" 
  });
  await newAdmin.save();
  return newAdmin;
}