import mongoose, { Document } from "mongoose";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { TextEncoder } from "util";

// types
import type { User } from "@civic-pulse/schemas";

// TextEncoder is needed for jose SignJWT to encode the secret key
const encoder = new TextEncoder();

export interface IUser extends User , Omit<Document, "id"> {
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): Promise<string>;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    id: { type: String, required: true, unique: true },
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["citizen", "operator", "department", "admin"], required: true },
    password: { type: String, required: true },
    aadhaar: { type: String, required: true, unique: true },
    phone: { type: String, required: true },

    // Department Specific
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },
  },
  { timestamps: true }
);

/*------------ middleware for password hashing ------------- */
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  else {
    this.password = await bcrypt.hash(this.password, 10);
  }
  if (!this.isModified("aadhaar")) return next();
  else {
    this.aadhaar = await bcrypt.hash(this.aadhaar, 10);
  }

  next();
});

UserSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.generateAccessToken = async function () {
  const secret = encoder.encode(process.env.ACCESS_TOKEN_SECRET!);

  return await new SignJWT({
    id: this._id.toString(),
    role: this.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(process.env.ACCESS_TOKEN_EXPIRY ?? "1d")
    .sign(secret);
};

export const UserModel = mongoose.model<IUser>("User", UserSchema);
