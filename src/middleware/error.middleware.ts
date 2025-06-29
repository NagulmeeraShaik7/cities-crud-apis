import { Request, Response, NextFunction } from "express";
import Logger from "../apps/utils/logger.utils";
import { ERROR_CONSTANTS } from "../infrasturcture/constants/city.contstants";

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
  const status = error.status || ERROR_CONSTANTS.DEFAULT_STATUS;
  const message = error.message || ERROR_CONSTANTS.DEFAULT_MESSAGE;

  Logger.error(`${ERROR_CONSTANTS.LOG_PREFIX}: ${message}, ${ERROR_CONSTANTS.STATUS_KEY}: ${status}`);

  res.status(status).json({
    [ERROR_CONSTANTS.RESPONSE_KEY]: {
      [ERROR_CONSTANTS.MESSAGE_KEY]: message,
      [ERROR_CONSTANTS.STATUS_KEY]: status
    }
  });
}
