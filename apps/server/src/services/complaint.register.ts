import { ComplaintModel } from "../model/complaint.model.js";
import { newComplaint } from "@civic-pulse/schemas";
import { analyzeComplaintForSpamService } from "./spam.detect.service.js";
import { createCanonicalHash } from "@civic-pulse/utils";
import { checkForDuplicateComplaintService } from "./duplicate.check.js";
import { getComplaintsService } from "./complaint.js";
import { uploadToS3 } from "./aws.service.js";
import { generateComplaintImageKey } from "@civic-pulse/utils";
import { createActivityLogService } from "./activity.service.js";
import { ApiError } from "@civic-pulse/utils";

export async function registerComplaintService(
  citizen: string,
  complaintData: newComplaint,
  imageBuffer?: Buffer
) {
  // Analyze complaint for spam
  const { isSpam, analysis } = await analyzeComplaintForSpamService(complaintData, imageBuffer);
  if (isSpam) {
    throw new ApiError(400, "Complaint detected as spam",false);
  }

  // Fetch existing complaints in the vicinity to check for duplicates (if location provided)
  let existingComplaints: any[] = [];
  if (complaintData.location?.coordinates) {
    existingComplaints = await getComplaintsService(complaintData.location.coordinates, 100);
  }

  const canonicalHash = createCanonicalHash(Object.values(analysis).join("|"));
  const duplicateWithHash = existingComplaints.find((c) => c.canonicalHash === canonicalHash);

  //   Create a canonical hash for the complaint based on its content and analysis results
  if (duplicateWithHash) {
    const duplicate = await ComplaintModel.findById(duplicateWithHash._id);
    duplicate?.supporters?.push(citizen);
    await duplicate?.save();
    return duplicate?.toObject();
  }
  console.log()

  const { isDuplicate, duplicateId, semanticVector } = await checkForDuplicateComplaintService(
    complaintData,
    existingComplaints
  );
  if (isDuplicate) {
    const duplicate = await ComplaintModel.findById(duplicateId);
    duplicate?.supporters?.push(citizen);
    await duplicate?.save();
    return duplicate?.toObject();
  }

  let imageKey: string | undefined;
  if (imageBuffer) {
    imageKey = generateComplaintImageKey(citizen, complaintData.title);
    await uploadToS3(imageBuffer, imageKey);
  }
  
  const newComplaintDoc = new ComplaintModel({
    ...complaintData,
    citizen,
    category: analysis.category,
    canonicalHash,
    semanticVector,
    ...(imageKey && { image: imageKey }),
  });
  await newComplaintDoc.save();

  // Log activity
  await createActivityLogService(
    citizen,
    `Complaint Created: ${complaintData.title} - Category: ${analysis.category}`
  ).catch(err => console.error("Failed to log activity:", err));

  return newComplaintDoc.toObject();
}
