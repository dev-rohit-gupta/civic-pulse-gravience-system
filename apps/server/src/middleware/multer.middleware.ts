import multer from "multer";
import { ApiError } from "@civic-pulse/utils";

/* ---------- config ---------- */

const MAX_FILE_SIZE =  256; // 256kb

const ALLOWED_MIME_TYPES = [
  "image/*", // image/jpeg, image/png, etc.
];

/* ---------- storage ---------- */
// Using memory storage to keep files in memory as Buffer objects
const storage = multer.memoryStorage();

/* ---------- file filter ---------- */
const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
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
