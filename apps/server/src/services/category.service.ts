import { CategoryModel } from "../model/category.model.js";

// Get all categories
export async function getCategoriesService() {
  const categories = await CategoryModel.find().select("-_id -__v").lean();
  return categories;
}

// Get a single category by id
export async function getCategoryByIdService(id: string) {
  const category = await CategoryModel.findOne({ id }).select("-_id -__v").lean();
  if (!category) {
    throw new Error("Category not found");
  }
  return category;
}

// Create a new category
export async function createCategoryService(categoryData: {
  id: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  isActive?: boolean;
}) {
  const existingCategory = await CategoryModel.findOne({
    $or: [{ id: categoryData.id }, { name: categoryData.name }],
  });
  if (existingCategory) {
    throw new Error("Category with the same ID or name already exists");
  }
  const category = new CategoryModel(categoryData);
  await category.save();
  return category;
}

// Update a category
export async function updateCategoryService(
  params: { id: string },
  updateData: { name?: string; description?: string | null; icon?: string | null; isActive?: boolean }
) {
  const updatedCategory = await CategoryModel.findOneAndUpdate(
    { id: params.id },
    updateData,
    { new: true, runValidators: true }
  );
  if (!updatedCategory) {
    throw new Error("Category not found");
  }
  return updatedCategory;
}

// Delete a category
export async function deleteCategoryService(params: { id: string }) {
  const deletedCategory = await CategoryModel.findOneAndDelete({
    id: params.id,
  });
  if (!deletedCategory) {
    throw new Error("Category not found");
  }
  return deletedCategory;
}
