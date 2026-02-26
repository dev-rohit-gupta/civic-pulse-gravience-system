export function generateDepartmentId() {
  return `department-${crypto.randomUUID()}`;
}