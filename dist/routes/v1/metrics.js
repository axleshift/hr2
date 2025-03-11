"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const verifySession_1 = __importDefault(require("../../middlewares/verifySession"));
const prometheusMetrics_1 = require("../../middlewares/prometheusMetrics");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
router.get("/", (0, verifySession_1.default)({
    permissions: ["admin", "superadmin"],
}, true, true), prometheusMetrics_1.metricsHandler);
exports.default = {
    metadata: {
        path: "/metrics",
        description: "Metrics route",
    },
    router,
};
