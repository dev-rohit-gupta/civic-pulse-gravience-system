import "express";
import { User } from "@civic-pulse/schemas";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: User["role"];
      };
    }
  }
}
