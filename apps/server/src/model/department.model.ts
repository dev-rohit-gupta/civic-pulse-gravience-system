

import mongoose from "mongoose";
import type { Department } from "@civic-pulse/schemas";

// Mongoose document interface - category is ObjectId in DB
interface IDepartment extends Omit<Department, 'category'> {
  category: mongoose.Types.ObjectId;
}

const DepartmentSchema = new mongoose.Schema<IDepartment>({
    id : {
        type : String,
        required : true,
        unique : true
    },
    title : {
        type : String,
        required : true,
        unique : true,
        minlength : 2,
        maxlength : 100
    },
    description : {
        type : String,
        required : true,
        minlength : 10,
        maxlength : 1000
    },
   category : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Category",
        required : true
    },
});

export const DepartmentModel = mongoose.model<IDepartment>("Department", DepartmentSchema);