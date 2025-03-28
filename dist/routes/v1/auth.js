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
const authController_1 = require("../../database/v1/controllers/authController");
router.post("/register", (0, verifySession_1.default)({
    permissions: []
}, true), authController_1.createUser);
router.post("/login", (0, verifySession_1.default)({
    permissions: []
}, true), authController_1.login);
router.get("/logout", (0, verifySession_1.default)({
    permissions: []
}, true), authController_1.logout);
router.get("/verify", (0, verifySession_1.default)({
    permissions: []
}, true), authController_1.verify);
exports.default = {
    metadata: {
        path: "/auth",
        description: "This route is used to register, login, logout and verify user",
    },
    router,
};
