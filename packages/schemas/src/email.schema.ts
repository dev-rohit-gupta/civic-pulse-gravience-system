import { z } from "zod";

/**
 * Schema for validating and parsing email data.
 */
export const emailSchema = z
  .string()
  .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), { message: "Invalid email" });
