"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
router.get("/", (req, res) => {
    res.json({
        message: "Hello, World!",
    });
});
exports.default = {
    metadata: {
        path: "/test",
        description: "Test route",
    },
    router,
};
