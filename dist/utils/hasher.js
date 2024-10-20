"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasher = void 0;
const logger_1 = __importDefault(require("../middlewares/logger"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const hasher = async (password, salt) => {
    try {
        const hashedPassword = bcryptjs_1.default.hash(password, salt);
        return hashedPassword;
    }
    catch (error) {
        logger_1.default.error("Error hashing password:", error);
        throw new Error("Error hashing password");
    }
};
exports.hasher = hasher;
