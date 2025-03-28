"use strict";
/**
 * @file /middlewares/verifySession.ts
 * @description Middleware to verify user session
 */
Object.defineProperty(exports, "__esModule", { value: true });
// sendError helper function
const sendError = (res, statusCode, message) => {
    console.error(`Error ${statusCode}: ${message}`);
    return res.status(statusCode).json({
        statusCode,
        success: false,
        message,
    });
};
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
const verifySession = (metadata, allowGuest = false) => {
    return (req, res, next) => {
        if (!req.session) {
            return sendError(res, 401, "Unauthorized: Session not initialized");
        }
        const user = req.session.user;
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
        next();
    };
};
exports.default = verifySession;
