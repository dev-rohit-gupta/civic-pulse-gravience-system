

import mongoose from "mongoose";
import { Department } from "@civic-pulse/schemas";

const DepartmentSchema = new mongoose.Schema<Department>({
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
        type : String,
        enum : ["Road", "Water", "Electricity", "Garbage", "Other"],
        required : true
    },
});

export const DepartmentModel = mongoose.model<Department>("Department", DepartmentSchema);