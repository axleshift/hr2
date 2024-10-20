"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const authController_1 = require("../../database/v1/controllers/authController");
router.post("/register", authController_1.createUser);
router.post("/login", authController_1.login);
router.get("/logout", authController_1.logout);
router.get("/verify", authController_1.verify);
exports.default = {
    metadata: {
        path: "/auth",
        method: ["POST", "GET"],
        description: "This route is used to register, login, logout and verify user",
        permissions: ["admin", "user", "guest"],
    },
    router,
};
