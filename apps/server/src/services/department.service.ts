import { DepartmentModel } from "../model/department.model.js";
import { CategoryModel } from "../model/category.model.js";

export async function getDepartmentsService() {
  const departments = await DepartmentModel.find()
    .populate('category', '-__v -_id') // Populate category details, exclude __v and _id
    .select("-__v")
    .lean();
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
  
  // Find category by id or name and get its MongoDB _id
  const category = await CategoryModel.findOne({ 
    $or: [{ id: departmentData.category }, { name: departmentData.category }] 
  });
  
  if (!category) {
    throw new Error(`Category '${departmentData.category}' not found`);
  }
  
  const department = new DepartmentModel({
    ...departmentData,
    category: category._id, // Use MongoDB ObjectId
  });
  await department.save();
  
  // Populate category before returning
  await department.populate('category', '-__v -_id');
  
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
  // If category is being updated, convert it to ObjectId
  let finalUpdateData = { ...updateData };
  
  if (updateData.category) {
    const category = await CategoryModel.findOne({ 
      $or: [{ id: updateData.category }, { name: updateData.category }] 
    });
    
    if (!category) {
      throw new Error(`Category '${updateData.category}' not found`);
    }
    
    finalUpdateData.category = category._id as any;
  }
  
  const updatedDepartment = await DepartmentModel.findOneAndUpdate(
    { id: params.id },
    finalUpdateData,
    { new: true, runValidators: true }
  )
    .populate('category', '-__v -_id');
    
  if (!updatedDepartment) {
    throw new Error("Department with the given ID does not exist");
  }
  return updatedDepartment;
}