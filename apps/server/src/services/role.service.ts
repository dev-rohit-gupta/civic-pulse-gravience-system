import { SystemRoleModel } from "../model/role.model.js";

// Get all roles
export async function getRolesService() {
  const roles = await SystemRoleModel.find().select("  -__v").lean();
  return roles;
}

// Get a single role by id
export async function getRoleByIdService(id: string) {
  const role = await SystemRoleModel.findOne({ id }).select("  -__v").lean();
  if (!role) {
    throw new Error("Role not found");
  }
  return role;
}

// Create a new role
export async function createRoleService(roleData: {
  id: string;
  name: string;
  description?: string | null;
  permissions?: string[];
  isActive?: boolean;
}) {
  const existingRole = await SystemRoleModel.findOne({
    $or: [{ id: roleData.id }, { name: roleData.name }],
  });
  if (existingRole) {
    throw new Error("Role with the same ID or name already exists");
  }
  const role = new SystemRoleModel(roleData);
  await role.save();
  return role;
}

// Update a role
export async function updateRoleService(
  params: { id: string },
  updateData: { name?: string; description?: string | null; permissions?: string[]; isActive?: boolean }
) {
  const updatedRole = await SystemRoleModel.findOneAndUpdate(
    { id: params.id },
    updateData,
    { new: true, runValidators: true }
  );
  if (!updatedRole) {
    throw new Error("Role not found");
  }
  return updatedRole;
}

// Delete a role
export async function deleteRoleService(params: { id: string }) {
  const deletedRole = await SystemRoleModel.findOneAndDelete({
    id: params.id,
  });
  if (!deletedRole) {
    throw new Error("Role not found");
  }
  return deletedRole;
}
