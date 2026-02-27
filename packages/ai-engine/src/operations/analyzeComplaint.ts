import { runEngine } from "../engine/run.engine.js";
import { EngineInput, newComplaint } from "@civic-pulse/schemas";
import { GenerateContentConfig, ThinkingLevel } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../prompts/system.prompt.js";
import { createGeminiClient } from "../client/gemini.client.js";
import { safeParseAIJson } from "@civic-pulse/utils";

const config: GenerateContentConfig = {
  systemInstruction: SYSTEM_INSTRUCTION.spamDetection,
  responseMimeType: "application/json",
  temperature: 0.2,
  topK: 1,
  topP: 0.1,
};

type results = {
    isSpam: boolean;
    analysis: {
      category: string;
      priorityScore: number;
      issue: string;
    };
  };

export async function validateAndAnalyzeComplaint(complaint: newComplaint, image?: Buffer) : Promise<results> {
  const inputs: EngineInput[] = [
    { type: "text", value: complaint.title },
    { type: "text", value: complaint.description },
  ];
  
  if (image) {
    inputs.push({ type: "file", buffer: image, mimeType: "image/jpeg" });
  }

  const instructions = SYSTEM_INSTRUCTION.spamDetection;
  const ai = createGeminiClient();
  const response = await runEngine({
    ai,
    model: process.env.GOOGLE_AI_MODEL || "gemini-2.5-flash",
    inputs,
    config,
  });

  const parsed = safeParseAIJson<results>(response);
  return parsed ;
}
