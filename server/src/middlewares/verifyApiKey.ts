/**
 * @file /middlewares/verifyApiKey.ts
 * @description Middleware to verify the API key
 */

import { Request, Response, NextFunction } from "express";

import apiKey from "../database/v1/models/apikey";
import { config } from "../config";
import logger from "./logger";

// sendError helper function
const sendError = (res: Response, statusCode: number, message: string) => {
  return res.status(statusCode).json({
    statusCode,
    success: false,
    message,
  });
};


interface CustomRequest extends Request {
  permissions?: string[];
}

// verifyApiKey middleware
const verifyApiKey = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const key = req.headers["x-api-key"] as string;
    const masterKey = config.api.masterKey as string;
    if (!key) {
      return sendError(res, 401, "Unauthorized");
    }

    // If master key is provided, bypass all checks
    if (key === masterKey) {
      req.permissions = ["*"]; // * -> Indicate full access
      return next();
    }

    const apiKeyData = await apiKey.findOne({ key }).select("permissions").lean();

    if (!apiKeyData) {
      return sendError(res, 401, "Unauthorized");
    }

    req.permissions = apiKeyData.permissions;
    next();
  } catch (error) {
    logger.error(`Error verifying API key: ${error}`);
    return sendError(res, 500, "Internal server error");
  }
};


export default verifyApiKey;
