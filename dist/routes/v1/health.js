"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const verifySession_1 = __importDefault(require("../../middlewares/verifySession"));
router.get("/", (0, verifySession_1.default)({
    permissions: ["user", "admin"],
}), (req, res) => {
    res.send("OK");
});
exports.default = {
    metadata: {
        path: "/health",
        description: "Health route",
    },
    router,
};
