import { DepartmentModel } from "../model/department.model.js";

export async function getDepartmentsService() {
  const departments = await DepartmentModel.find().select("  -__v").lean();
  return departments;
}

export async function createDepartmentService(departmentData: {
  id: string;
  title: string;
  description: string;
  category: string;
}) {
  const existingDepartment = await DepartmentModel.findOne({
    $or: [{ id: departmentData.id }, { title: departmentData.title }],
  });
  if (existingDepartment) {
    throw new Error("Department with the same ID or title already exists");
  }
  const department = new DepartmentModel(departmentData);
  await department.save();
  return department;
}

export async function deleteDepartmentService(params: { id: string }) {
  const deletedDepartment = await DepartmentModel.findOneAndDelete({
    id: params.id,
  });
  if (!deletedDepartment) {
    throw new Error("Department with the given ID does not exist");
  }
  return deletedDepartment;
}

export async function updateDepartmentService(
  params: { id: string },
  updateData: { title?: string; description?: string; category?: string }
) {
  const updatedDepartment = await DepartmentModel.findOneAndUpdate(
    { id: params.id },
    updateData,
    { new: true, runValidators: true }
  );
  if (!updatedDepartment) {
    throw new Error("Department with the given ID does not exist");
  }
  return updatedDepartment;
}