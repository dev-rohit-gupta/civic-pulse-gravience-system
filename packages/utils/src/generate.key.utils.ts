import path from "path";
export function generateComplaintImageKey(userId: string, fileName: string) {
  const extension = path.extname(fileName);
  return `complaint-images/${userId}-${crypto.randomUUID()}-image${extension}`;
}
