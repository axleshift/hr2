"use strict";
/**
 * @file /utils/generateApikey.ts
 * @description Generates an API key
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateApikey = void 0;
const logger_1 = __importDefault(require("../middlewares/logger"));
const apikey_1 = __importDefault(require("../database/v1/models/apikey"));
const generateApikey = async () => {
    try {
        const key = Math.random().toString(36).substring(7);
        const apiKeyData = await apikey_1.default.create({
            key: key,
            owner: "67aedc4d9126428016e044ac",
            permissions: ["admin"],
            expiresAt: new Date(),
        });
        return apiKeyData;
    }
    catch (error) {
        logger_1.default.error("Error generating API key:", error);
        throw new Error("Error generating API key");
    }
};
exports.generateApikey = generateApikey;
