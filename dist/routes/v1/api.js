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
const apiKeyController_1 = require("../../database/v1/controllers/apiKeyController");
router.get("/update/:id", (0, verifySession_1.default)({
    permissions: ["user", "admin"],
}, true, true), apiKeyController_1.updateApikey);
exports.default = {
    metadata: {
        path: "/api",
        description: "This route is used to add, update, delete, get all, get by id and search test data",
    },
    router,
};
