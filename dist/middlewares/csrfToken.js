"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateCsrfToken = async (req, res, next) => {
    // Ensure that the session exists
    if (!req.session) {
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Session not initialized properly.",
        });
    }
    // If csrfToken is not already set, generate and store it
    if (!req.session.csrfToken) {
        try {
            const salt = await bcryptjs_1.default.genSalt(10);
            const csrfToken = await bcryptjs_1.default.hash(req.sessionID, salt); // Generate CSRF token from sessionID
            req.session.csrfToken = csrfToken; // Save CSRF token in session
        }
        catch (error) {
            return res.status(500).json({
                statusCode: 500,
                success: false,
                message: error,
            });
        }
    }
    next(); // Proceed to the next middleware
};
exports.default = generateCsrfToken;
