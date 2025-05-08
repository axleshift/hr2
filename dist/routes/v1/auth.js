"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// import verifySession from '../../middlewares/verifySession';
const authController_1 = require("../../database/v1/controllers/authController");
router.post('/register', authController_1.createUser);
router.post('/login', authController_1.login);
router.get('/logout', authController_1.logout);
router.get('/me', authController_1.verify);
router.post('/send-otp', authController_1.sendOTP);
router.post('/verify-otp', authController_1.verifyOTP);
// Google OAuth
router.get('/google', authController_1.googleAuth);
router.get('/google/callback', authController_1.googleCallback);
exports.default = {
    metadata: {
        path: '/auth',
        description: 'This route is used to register, login, logout, and verify user',
    },
    router,
};
