"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const testController_1 = require("../../database/v1/controllers/testController");
router.post("/", testController_1.createTest);
router.get("/", testController_1.getAllTests);
exports.default = {
    metadata: {
        path: "/test",
        method: ["POST", "GET"],
        description: "Test route",
        permissions: ["admin", "user", "guest"],
    },
    router,
};
