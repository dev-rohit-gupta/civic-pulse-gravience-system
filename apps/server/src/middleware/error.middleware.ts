import { ApiError } from "@civic-pulse/utils";
import { Request, Response, NextFunction } from "express";

export function errorMiddleware(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  // Known / expected error
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Unknown error but still an Error object
  if (err instanceof Error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(err.stack || err);
    }
    console.error("Unexpected Error:", err.message);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }

  // Very rare non-error throw (string, number, etc.)
  console.error("Non-error thrown:", err);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
}
