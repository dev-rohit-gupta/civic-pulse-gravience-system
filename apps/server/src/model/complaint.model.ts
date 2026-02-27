import mongoose from "mongoose";
import type { Complaint } from "@civic-pulse/schemas";

type Icomplaint  = Complaint & mongoose.Document;

const complaintSchema = new mongoose.Schema<Icomplaint>(
  {
    citizen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Optional for public submissions
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
      required: false, // Optional for public submissions
    },
    location: {
      coordinates: {
        type: [Number, Number], // [lng, lat]
        required: false, // Optional for public submissions
      },
    },
    category: {
      type: String,
      enum: ["Road", "Water", "Electricity", "Garbage", "Other"],
      required: true,
    },
    // Public submission fields
    id: {
      type: String,
      unique: true,
      sparse: true, // Allows null values while maintaining uniqueness for non-null values
    },
    isPublicSubmission: {
      type: Boolean,
      default: false,
    },
    citizenName: {
      type: String,
    },
    citizenPhone: {
      type: String,
    },
    citizenAadhaar: {
      type: String,
    },
    citizenEmail: {
      type: String,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    city: {
      type: String,
    },
    ward: {
      type: String,
    },
    address: {
      type: String,
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
      required: false, // Optional for public submissions, will be assigned later
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
    escalationLevel: {
      type: Number,
      default: 0,
    },
    escalationHistory: {
      type: [
        {
          escalatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          escalatedAt: { type: Date },
          reason: { type: String },
          fromRole: { type: String, enum: ["operator", "department", "admin"] },
          toRole: { type: String, enum: ["operator", "department", "admin"] },
        },
      ],
      default: [],
    },
    currentHandler: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

export const ComplaintModel = mongoose.model<Icomplaint>("Complaint", complaintSchema);
