"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file /middlewares/csrfToken.ts
 * @description Middleware to generate CSRF token
 * @description This middleware generates a CSRF token from the sessionID and stores it in the session
 */
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = require("../config");
const generateCsrfToken = async (req, res, next) => {
    if (!req.session) {
        return res.status(500).json({ success: false, message: "Session not initialized properly." });
    }
    if (!req.session.csrfToken) {
        try {
            const salt = await bcryptjs_1.default.genSalt(10);
            const csrfToken = await bcryptjs_1.default.hash(req.sessionID, salt);
            req.session.csrfToken = csrfToken;
        }
        catch (error) {
            return res.status(500).json({ success: false, message: error });
        }
    }
    // 🔹 Set CSRF token as an HTTP-only cookie
    res.cookie("csrfToken", req.session.csrfToken, {
        httpOnly: config_1.config.env === "production",
        secure: config_1.config.env === "production",
        sameSite: "strict",
    });
    next();
};
exports.default = generateCsrfToken;
