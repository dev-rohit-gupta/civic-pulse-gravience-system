import { ApiError } from "./apiError.js";

export const BadRequest = (msg = "Bad Request") => new ApiError(400, msg);

export const Unauthorized = (msg = "Unauthorized") => new ApiError(401, msg);

export const Forbidden = (msg = "Forbidden") => new ApiError(403, msg);

export const NotFound = (msg = "Not Found") => new ApiError(404, msg);
