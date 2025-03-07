"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./logger"));
const errorHandler = (err, req, res, next) => {
    if (!(res instanceof Response)) {
        return next(new Error("Invalid response object"));
    }
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";
    logger_1.default.error(`${status} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    res.status(status).json({
        status,
        message,
    });
};
exports.default = errorHandler;
