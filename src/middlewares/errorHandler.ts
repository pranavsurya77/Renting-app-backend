import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import logger from "../utils/winston";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  } else {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
  logger.error(err.stack);
};
