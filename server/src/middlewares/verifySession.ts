/**
 * @file /middlewares/verifySession.ts
 * @description Middleware to verify user session
 */

import { Request, Response, NextFunction } from "express";
import { config } from "../config";

// sendError helper function
const sendError = (res: Response, statusCode: number, message: string) => {
  return res.status(statusCode).json({
    statusCode,
    success: false,
    message,
  });
};

// validate csrf token helper function
const validateCSRFToken = (req: Request, res: Response) => {
  const csrfToken = req.session.csrfToken;
  const clientToken = (req.headers["x-csrf-token"] as string) || (csrfToken as string);
  return csrfToken === clientToken;
};

interface Metadata {
  permissions: string[];
}

/**
 * verifySession middleware
 * @param metadata - Metadata object containing permissions
 * @param validateCsrf - Boolean to enable/disable CSRF token validation (default: true)
 * @param allowGuest - Boolean to allow guest access without session (default: false)
 * @returns Express middleware
 * 
 * @description This middleware verifies the user session and permissions based on the metadata object provided
 * It also validates the CSRF token if enabled
 * It allows guest access if enabled
 */

const verifySession = (metadata: Metadata, validateCsrf = true, allowGuest = false) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.session) {
      return sendError(res, 401, "Unauthorized: Session not initialized");
    }

    const user = req.session.user;

    // Guard clause extravaganza.. let's gooo

    if (!user) {
      if (allowGuest) {
        return next(); // Allow access if guest access is enabled
      }
      return sendError(res, 401, "Unauthorized: Invalid or missing user session");
    }

    if (!user.role || typeof user.role !== "string") {
      return sendError(res, 401, "Unauthorized: User role is invalid");
    }

    const permissions = metadata.permissions;
    if (permissions.length > 0 && !permissions.includes(user.role)) {
      return sendError(res, 403, "Forbidden: Insufficient permissions");
    }

    if (validateCsrf && config.server.csrfProtection && !validateCSRFToken(req, res)) {
      return sendError(res, 403, "Forbidden: Invalid CSRF token");
    }

    next();
  };
};



export default verifySession;
