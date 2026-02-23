import { z } from "zod";

/* ---------- helpers ---------- */

// Buffer runtime me class hota hai (Node.js)
const BufferSchema = z.instanceof(Buffer);

/* ---------- EngineInput schemas ---------- */

const TextInputSchema = z.object({
  type: z.literal("text"),
  value: z.string().min(1, "Text input cannot be empty"),
});

const FileInputSchema = z.object({
  type: z.literal("file"),
  buffer: BufferSchema,
  mimeType: z.string().min(1),
});

const MetadataInputSchema = z.object({
  type: z.literal("metadata"),
  value: z.record(z.string(), z.unknown()),
});

/* ---------- Union ---------- */

export const EngineInputSchema = z.discriminatedUnion("type", [
  TextInputSchema,
  FileInputSchema,
  MetadataInputSchema,
]);

export type EngineInput = z.infer<typeof EngineInputSchema>;
