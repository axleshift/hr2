"use strict";
/**
 * @file /middlewares/verifyApiKey.ts
 * @description Middleware to verify the API key
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apikey_1 = __importDefault(require("../database/v1/models/apikey"));
const config_1 = require("../config");
const logger_1 = __importDefault(require("./logger"));
// sendError helper function
const sendError = (res, statusCode, message) => {
    return res.status(statusCode).json({
        statusCode,
        success: false,
        message,
    });
};
// verifyApiKey middleware
const verifyApiKey = async (req, res, next) => {
    try {
        const key = req.headers["x-api-key"];
        const masterKey = config_1.config.api.masterKey;
        if (!key) {
            return sendError(res, 401, "Unauthorized");
        }
        // If master key is provided, bypass all checks
        if (key === masterKey) {
            req.permissions = ["*"]; // * -> Indicate full access
            return next();
        }
        const apiKeyData = await apikey_1.default.findOne({ key }).select("permissions").lean();
        if (!apiKeyData) {
            return sendError(res, 401, "Unauthorized");
        }
        req.permissions = apiKeyData.permissions;
        next();
    }
    catch (error) {
        logger_1.default.error(`Error verifying API key: ${error}`);
        return sendError(res, 500, "Internal server error");
    }
};
exports.default = verifyApiKey;
