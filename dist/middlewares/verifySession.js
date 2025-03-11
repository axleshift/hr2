"use strict";
/**
 * @file /middlewares/verifySession.ts
 * @description Middleware to verify user session
 */
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
// sendError helper function
const sendError = (res, statusCode, message) => {
    console.error(`Error ${statusCode}: ${message}`);
    return res.status(statusCode).json({
        statusCode,
        success: false,
        message,
    });
};
// validate csrf token helper function
const validateCSRFToken = (req) => {
    const csrfToken = req.session?.csrfToken;
    const clientToken = req.headers["x-csrf-token"] || csrfToken;
    return csrfToken && clientToken && csrfToken === clientToken;
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
const verifySession = (metadata, validateCsrf = true, allowGuest = false) => {
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
        if (validateCsrf && config_1.config.server.csrfProtection && !validateCSRFToken(req)) {
            return sendError(res, 403, "Forbidden: Invalid CSRF token");
        }
        next();
    };
};
exports.default = verifySession;
