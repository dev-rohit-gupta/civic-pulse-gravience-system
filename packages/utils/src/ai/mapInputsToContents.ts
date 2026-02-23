import { EngineInput } from "@resume-buddy/schemas";

/**
 *  Map EngineInput array to contents suitable for AI engine consumption.
 * @param inputs - Array of EngineInput objects.
 * @returns  Array of contents formatted for AI engine.
 */
export function mapInputsToContents(inputs: EngineInput[]) {
  return inputs.map((input) => {
    if (input.type === "text") {
      return { text: input.value };
    }

    if (input.type === "metadata") {
      return {
        text: JSON.stringify(input.value, null, 2),
      };
    }

    if (input.type === "file") {
      return {
        inlineData: {
          mimeType: input.mimeType,
          data: input.buffer.toString("base64"),
        },
      };
    }

    throw new Error("Unsupported input type");
  });
}
