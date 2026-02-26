import mongoose from "mongoose";
import type { Complaint } from "@civic-pulse/schemas";

const complaintSchema = new mongoose.Schema<Complaint>(
  {
    citizen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 2000,
    },
    image: {
      type: String,
      required: true,
    },
    location: {
      coordinates: {
        type: [Number, Number], // [lng, lat]
        required: true,
      },
    },
    category: {
      type: String,
      enum: ["Road", "Water", "Electricity", "Garbage", "Other"],
      required: true,
    },
    supporters: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
      required: true,
    },
    semanticVector: {
      type: [Number],
      default: null,
    },
    canonicalHash: {
      type: String,
      default: null,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    operator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "assigned",
        "under_progress",
        "resolved",
        "closed",
        "rejected",
      ],
      default: "pending",
    },
    priorityScore: {
      type: Number,
      default: 0,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    closedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export const ComplaintModel = mongoose.model<Complaint>("Complaint", complaintSchema);
