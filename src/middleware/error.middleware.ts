import { Request, Response, NextFunction } from "express";
import Logger from "../apps/utils/logger.utils"; // Simplified logger for demonstration

/**
 * Middleware to handle errors in the application.
 * @param {any} error - The error object.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next function.
 * @returns {void} Sends an error response.
 */
export default function errorMiddleware(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status = error.status || 500;
  const message = error.message || "Internal Server Error";
  Logger.error(`Error: ${message}, Status: ${status}`);
  res.status(status).json({
    error: {
      message,
      status
    }
  });
}