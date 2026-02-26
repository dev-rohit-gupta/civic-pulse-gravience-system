import { z } from "zod";

/**
 * AI-friendly optional string
 * - "" → undefined
 * - null → undefined
 */
export const stringSchema = z.string().trim().nullable().catch(null);

/**
 * AI-friendly optional URL
 * - null / "" → undefined
 * - allows missing protocol (adds https later if needed)
 */
export const urlSchema = z
  .string()
  .trim()
  .nullable()
  .refine((v) => !v || /^https?:\/\//i.test(v) || /^[\w.-]+\.[a-z]{2,}/i.test(v), "Invalid URL")
  .catch(null);

/**
 * Safe array (AI sometimes sends null instead of [])
 */
export const safeArray = <T extends z.ZodTypeAny>(schema: T) =>
  z
    .array(schema)
    .nullable()
    .transform((v) => v ?? undefined);
/**
 * Schema for validating and parsing email data.
 */
export const emailSchema = z
  .string()
  .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), { message: "Invalid email" });