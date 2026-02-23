import path from "path";
export function generateResumeKey(userId: string, fileName: string) {
  const extension = path.extname(fileName);
  return `resumes/${userId}-${crypto.randomUUID()}-resume${extension}`;
}
