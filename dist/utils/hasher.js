"use strict";
/**
 * @file hasher.ts
 * @description Hashes a string using bcrypt
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasher = void 0;
const logger_1 = __importDefault(require("../middlewares/logger"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const hasher = async (string, salt) => {
    try {
        const hashedString = bcryptjs_1.default.hash(string, salt);
        return hashedString;
    }
    catch (error) {
        logger_1.default.error("Error hashing string:", error);
        throw new Error("Error hashing string");
    }
};
exports.hasher = hasher;
