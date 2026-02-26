import { ComplaintModel } from "../model/complaint.model.js";
import { Complaint , newComplaint } from "@civic-pulse/schemas";
import { analyzeComplaintForSpamService } from "./spam.detect.service.js";
import { createCanonicalHash } from "@civic-pulse/utils";
import { checkForDuplicateComplaintService } from "./duplicate.check.js";
import { getS3Object } from "./aws.service.js";
import { UserModel } from "../model/user.model.js";

export async function getComplaintsService(coordinates: [number, number], radius: number) {
    const complaints = await ComplaintModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [
                    [coordinates[0], coordinates[1]],
                    radius / 6378100 // Convert radius from meters to radians
                ]
            }
        }
    }).lean()
    return complaints;
}

export async function getComplaintService(id : string) {
    
    const complaint = await ComplaintModel.findById(id)
    .select("id title description image location createdAt updatedAt")

    const imageData = await getS3Object(complaint?.image!);

    return { ...complaint, imageData };
}

