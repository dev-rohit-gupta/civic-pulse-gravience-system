import multer from "multer";
import { ApiError } from "@civic-pulse/utils";

/* ---------- config ---------- */

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/* ---------- storage ---------- */
// Using memory storage to keep files in memory as Buffer objects
const storage = multer.memoryStorage();

/* ---------- file filter ---------- */
const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  // Check if the mimetype starts with "image/" for broader compatibility
  if (!file.mimetype.startsWith("image/")) {
    return cb(new ApiError(400, "Invalid file type. Only image files are allowed."));
  }

  cb(null, true);
};

/* ---------- multer instance ---------- */
export const uploader = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});
