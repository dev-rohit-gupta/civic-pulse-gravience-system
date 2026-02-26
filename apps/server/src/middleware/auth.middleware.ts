import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, getToken } from "@civic-pulse/utils";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = getToken(req);
  if (!token) {
    return res.redirect("/login");
  }

  try {
    const payload = await verifyAccessToken(token);

    req.user = {
      id: payload.id,
      role: payload.role,
    };

    next();
  } catch {
    return res.redirect("/login");
  }
}

export async function requireGuest(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(); // guest allowed
  }
  try {
    await verifyAccessToken(token);
    // token valid → already logged in
    return res.redirect("/dashboard");
  } catch {
    // token invalid → treat as guest
    return next();
  }
}
