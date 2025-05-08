"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const dotenv_1 = __importDefault(require("dotenv"));
const verifySession_1 = __importDefault(require("../../middlewares/verifySession"));
const statisticController_1 = require("../../database/v1/controllers/statisticController");
dotenv_1.default.config();
router.get("/", (0, verifySession_1.default)({
    permissions: ["admin", "manager", "recruiter"],
}), statisticController_1.statistics);
exports.default = {
    metadata: {
        path: "/stats",
        description: "Test route",
    },
    router,
};
