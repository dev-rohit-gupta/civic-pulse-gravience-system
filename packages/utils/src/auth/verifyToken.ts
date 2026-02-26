import { jwtVerify } from "jose";
import { User } from "@civic-pulse/schemas";

export async function verifyAccessToken(token: string) {
  const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET!);

  const { payload } = await jwtVerify<{
    id: string;
    role: User["role"];
  }>(token, secret);

  return payload;
}
export function getToken(req: any) {
  return req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
}
