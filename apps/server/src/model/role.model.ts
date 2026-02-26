import mongoose from "mongoose";
import { SystemRole } from "@civic-pulse/schemas";

const SystemRoleMongooseSchema = new mongoose.Schema<SystemRole>({
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
    permissions: {
        type: [String],
        default: []
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export const SystemRoleModel = mongoose.model<SystemRole>("SystemRole", SystemRoleMongooseSchema);
