import { GoogleGenAI } from "@google/genai";

export function createGeminiClient() {
  if (!process.env.GOOGLE_GENAI_API_KEY) {
    throw new Error("Missing GOOGLE_GENAI_API_KEY environment variable");
  }
  return new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY!,
  });
}
