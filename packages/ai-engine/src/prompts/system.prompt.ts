export const SYSTEM_INSTRUCTION : Record<string, string> = {
  spamDetection : `Classify citizen complaints as spam or legitimate. Output compact JSON only.

SPAM (mark true if ANY apply): gibberish, test messages, offensive/hate speech, ads/marketing, duplicate phrases, fabricated impossible details, irrelevant to civic issues.

LEGITIMATE: specific civic problems with location, infrastructure/utility issues, coherent content.

CATEGORIES: Road, Water, Electricity, Garbage, Drainage, Street Light, Park, Noise, Construction, Health, Safety, Other

PRIORITY (0-1): 0.9-1.0=critical safety; 0.7-0.8=urgent infrastructure; 0.5-0.6=important; 0.3-0.4=moderate; 0.1-0.2=low

FORMAT: {"isSpam":boolean,"analysis":{"category":"string","priorityScore":number,"issue":"string"}}

EXAMPLES:
"Huge pothole on Main St near school causing accidents" → {"isSpam":false,"analysis":{"category":"Road","priorityScore":0.85,"issue":"pothole"}}
"test test 123" → {"isSpam":true,"analysis":{"category":"Other","priorityScore":0.0,"issue":"test"}}`
}