import { ComplaintSchema, Complaint, newComplaint } from "@civic-pulse/schemas";
import { validateAndAnalyzeComplaint } from "@civic-pulse/ai-engine";

export async function analyzeComplaintForSpamService(
  newComplaint: newComplaint,
  imageBuffer: Buffer
): Promise<{
  isSpam: boolean;
  analysis: { category: string; priorityScore: number; issue: string };
}> {
  // Call AI engine to analyze for spam
  const analysisResult = await validateAndAnalyzeComplaint(newComplaint, imageBuffer);
  return analysisResult;
}





