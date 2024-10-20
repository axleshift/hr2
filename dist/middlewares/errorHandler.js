"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_1 = __importDefault(require("./logger"));
const errorHandler = (err, req, res) => {
    logger_1.default.error(err);
    return res.status(500).json({
        statusCode: res.statusCode || 500,
        success: false,
        message: err.message,
        stack: err.stack,
    });
};
exports.errorHandler = errorHandler;
