"use strict";
/**
 * @file /middlewares/sanitize.ts
 * @description Middleware to sanitize user input
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const sanitize = (req, res, next) => {
    express_mongo_sanitize_1.default.sanitize(req.body);
    express_mongo_sanitize_1.default.sanitize(req.params);
    express_mongo_sanitize_1.default.sanitize(req.query);
    next();
};
exports.default = sanitize;
