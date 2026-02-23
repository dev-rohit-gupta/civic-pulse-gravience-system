function safeParseAIJson<T>(raw: unknown): T {
  // Case 1: Already parsed object
  if (typeof raw === "object" && raw !== null) {
    return raw as T;
  }

  if (typeof raw !== "string") {
    throw new Error("AI output is neither string nor object");
  }

  // Case 2: Clean string JSON
  const trimmed = raw.trim();

  // Fast path: pure JSON
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    return JSON.parse(trimmed) as T;
  }

  // Slow path: extract JSON safely
  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error("No JSON object found in AI output");
  }

  const jsonOnly = trimmed.slice(firstBrace, lastBrace + 1);
  return JSON.parse(jsonOnly) as T;
}

export { safeParseAIJson };
