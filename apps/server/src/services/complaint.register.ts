import { ComplaintModel } from "../model/complaint.model.js";
import { Complaint , newComplaint } from "@civic-pulse/schemas";
import { analyzeComplaintForSpamService } from "./spam.detect.service.js";
import { createCanonicalHash } from "@civic-pulse/utils";

export async function registerComplaintService(
  complaintData: newComplaint,
  imageBuffer : Buffer
) {
    // Analyze complaint for spam
    const { isSpam, analysis } = await analyzeComplaintForSpamService(complaintData,imageBuffer);
    if (isSpam) {
        throw new Error("Complaint detected as spam");
    }
    const canonicalHash = createCanonicalHash(Object.values(analysis).join("|"));


}
