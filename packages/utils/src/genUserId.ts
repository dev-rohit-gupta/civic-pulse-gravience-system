export function generateUserId() {
  return `user-${crypto.randomUUID()}`;
}