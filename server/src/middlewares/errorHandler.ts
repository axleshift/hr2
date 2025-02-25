import { Request, Response, NextFunction } from "express";
import logger from "./logger";

interface CustomError extends Error {
  status?: number;
}

const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  logger.error(`${status} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  res.status(status).json({
    status,
    message,
  });
};

export default errorHandler;
