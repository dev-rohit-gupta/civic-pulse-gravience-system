import { DepartmentModel } from "../model/department.model.js";

export async function getDepartmentsService() {
    const departments = await DepartmentModel.find().select("-_id -__v").lean();
    return departments;
}