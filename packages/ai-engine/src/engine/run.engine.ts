import { GoogleGenAI, GenerateContentConfig } from "@google/genai";
import { EngineInput } from "@resume-buddy/schemas";
import { mapInputsToContents } from "@resume-buddy/utils";
interface RunEngineParams {
  ai: InstanceType<typeof GoogleGenAI>;
  inputs: EngineInput[];
  model: string;
  config: GenerateContentConfig;
}

/**
 *  Run the AI engine with the given prompt and configuration.
 * @returns The generated content from the AI engine.
 */
export async function runEngine({
  ai,
  model,
  inputs,
  config,
}: RunEngineParams) {
  const contents = mapInputsToContents(inputs);

  const response = await ai.models.generateContent({
    model,
    contents,
    config,
  });

  if (!response?.text) {
    throw new Error("Empty AI response");
  }
  if (process.env.NODE_ENV !== "production") {
  console.log("AI model used : ", response.modelVersion);
  console.log("AI Tokens Used:", response.usageMetadata);
  console.log("AI Response:", response.text);
  }
  return response.text;
}
