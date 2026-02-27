import type { newComplaint, Complaint } from "@civic-pulse/schemas";
import { ComplaintSchema } from "@civic-pulse/schemas";
import type { Types } from "mongoose";

// MongoDB document type with _id
type ComplaintDocument = Complaint & { _id: Types.ObjectId };

// Python microservice URL for similarity detection
const SIMILARITY_API_URL = process.env.SIMILARITY_API_URL || "http://127.0.0.1:8000";

// Similarity threshold for duplicate detection (0.0 to 1.0)
// Higher value = stricter duplicate detection
const DUPLICATE_THRESHOLD = parseFloat(process.env.DUPLICATE_THRESHOLD || "0.85");

interface SimilarityResponse {
  similarity: number;
}

/**
 * Get text embedding from Python microservice
 */
async function getEmbedding(text: string): Promise<number[] | null> {
  try {
    const response = await fetch(`${SIMILARITY_API_URL}/embedding`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      console.error(`Failed to get embedding: ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data.embedding || null;
  } catch (error) {
    console.error("Error getting embedding from Python service:", error);
    return null;
  }
}

/**
 * Calculate similarity between two texts using Python microservice
 */
async function checkSimilarity(text1: string, text2: string): Promise<number> {
  try {
    const response = await fetch(`${SIMILARITY_API_URL}/similarity`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text1, text2 }),
    });

    if (!response.ok) {
      console.error(`Failed to check similarity: ${response.statusText}`);
      return 0;
    }

    const data: SimilarityResponse = await response.json();
    return data.similarity || 0;
  } catch (error) {
    console.error("Error checking similarity with Python service:", error);
    return 0;
  }
}

/**
 * Check if a new complaint is a duplicate of existing complaints
 * Uses semantic similarity with AI embeddings
 */
export async function checkForDuplicateComplaintService(
  newComplaint: newComplaint,
  existingComplaints: ComplaintDocument[]
) {
  console.log(`Checking for duplicates among ${existingComplaints.length} existing complaints...`);
  try {
    // Combine title and description for better semantic matching
    const newComplaintText = `${newComplaint.title} ${newComplaint.description}`.trim();

    // Get semantic embedding for the new complaint
    const semanticVector = await getEmbedding(newComplaintText);

    if (!semanticVector) {
      console.warn("Failed to get embedding, falling back to no duplicate detection");
      return {
        isDuplicate: false,
        duplicateId: null,
        semanticVector: null,
      };
    }

    // Check similarity with each existing complaint
    let maxSimilarity = 0;
    let duplicateComplaintId: string | null = null;

    for (const existingComplaint of existingComplaints) {
      // Skip if existing complaint doesn't have title/description
      if (!existingComplaint.title || !existingComplaint.description) {
        continue;
      }

      const existingText = `${existingComplaint.title} ${existingComplaint.description}`.trim();

      // Calculate semantic similarity
      const similarity = await checkSimilarity(newComplaintText, existingText);

      console.log(
        `Similarity between new complaint and ${existingComplaint._id}: ${similarity.toFixed(4)}`
      );

      // Track the most similar complaint
      if (similarity > maxSimilarity) {
        maxSimilarity = similarity;
        duplicateComplaintId = existingComplaint._id?.toString() || null;
      }

      // Early exit if duplicate found (above threshold)
      if (similarity >= DUPLICATE_THRESHOLD) {
        console.log(
          `⚠️  Duplicate detected! Similarity: ${similarity.toFixed(4)} (threshold: ${DUPLICATE_THRESHOLD})`
        );
        return {
          isDuplicate: true,
          duplicateId: duplicateComplaintId,
          semanticVector,
          similarity: similarity,
        };
      }
    }

    console.log(
      `✅ No duplicate found. Max similarity: ${maxSimilarity.toFixed(4)} (threshold: ${DUPLICATE_THRESHOLD})`
    );

    return {
      isDuplicate: false,
      duplicateId: null,
      semanticVector,
      similarity: maxSimilarity,
    };
  } catch (error) {
    console.error("Error in duplicate detection:", error);
    // On error, allow the complaint to proceed (fail open)
    return {
      isDuplicate: false,
      duplicateId: null,
      semanticVector: null,
    };
  }
}