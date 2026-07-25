import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import AppError from "./appError";
import config from "../config";

export const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let message = "Something went wrong";

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    stack: (config.node_env as string) ? error.stack : undefined,
  });
};
