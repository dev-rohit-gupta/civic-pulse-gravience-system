import mongoose from "mongoose";
import { Category } from "@civic-pulse/schemas";

const CategorySchema = new mongoose.Schema<Category>({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: 2,
        maxlength: 50
    },
    description: {
        type: String,
        maxlength: 500,
        default: null
    },
    icon: {
        type: String,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export const CategoryModel = mongoose.model<Category>("Category", CategorySchema);
