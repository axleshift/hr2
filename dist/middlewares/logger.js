"use strict";
/**
 * @file /middlewares/logger.ts
 * @description Middleware to log HTTP requests
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pino_1 = __importDefault(require("pino"));
const config_1 = require("../config");
const logger = (0, pino_1.default)({
    level: config_1.config.env === "production" ? "info" : "debug",
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true, // Colorize logs
            translateTime: true, // Add timestamps
            ignore: "pid,hostname", // Ignore process ID and hostname in logs
        },
    }
});
exports.default = logger;
