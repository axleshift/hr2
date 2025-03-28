"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmail = exports.logout = exports.verify = exports.login = exports.createUser = void 0;
const hasher_1 = require("../../../utils/hasher");
const userModel_1 = __importDefault(require("../models/userModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../../config");
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = __importDefault(require("../../../middlewares/logger"));
dotenv_1.default.config();
const salt = bcryptjs_1.default.genSaltSync(10);
const createUser = async (req, res) => {
    const { firstname, lastname, email, username, password } = req.body;
    if (!firstname || !lastname || !email || !username || !password) {
        return res.status(400).json({
            statusCode: 400,
            success: false,
            message: "Please provide all required fields",
        });
    }
    try {
        // const user = await User.create({
        //     firstname: await hasher(firstname, salt),
        //     lastname: await hasher(lastname, salt),
        //     email,
        //     username,
        //     password: await hasher(password, salt),
        //     rememberToken: salt,
        // });
        const generateVerificationCode = () => {
            const code = Math.floor(100000 + Math.random() * 900000);
            // 5 minutes
            const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
            return { code, expiresAt };
        };
        const user = await userModel_1.default.create({
            firstname,
            lastname,
            email,
            emailVerifiedAt: null,
            verification: {
                code: generateVerificationCode().code,
                expiresAt: generateVerificationCode().expiresAt,
            },
            username,
            password: await (0, hasher_1.hasher)(password, salt),
            rememberToken: salt,
        });
        res.status(201).json({
            statusCode: 201,
            success: true,
            message: "User created successfully",
            user,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error creating user",
            error,
        });
    }
};
exports.createUser = createUser;
const login = async (req, res) => {
    const { username, password } = req.body;
    logger_1.default.info(`User ${username} is trying to login`);
    try {
        const user = await userModel_1.default.findOne({ username });
        if (!user) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "User not found",
            });
        }
        const isPasswordValid = bcryptjs_1.default.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                statusCode: 401,
                success: false,
                message: "Invalid credentials",
            });
        }
        const jwtSecret = config_1.config.server.jwt.secret;
        const token = jsonwebtoken_1.default.sign({ username, id: user._id }, jwtSecret, {
            expiresIn: "1h",
        });
        const userData = {
            _id: user._id.toString(),
            firstname: user.firstname,
            lastname: user.lastname,
            username: user.username,
            role: user.role,
            email: user.email,
            status: user.status,
            token,
            emailVerifiedAt: user.emailVerifiedAt || null,
        };
        // ✅ Regenerate session to prevent fixation attack
        req.session.regenerate((err) => {
            if (err) {
                return res.status(500).json({
                    statusCode: 500,
                    success: false,
                    message: "Error regenerating session",
                });
            }
            req.session.user = userData;
            req.session.save((saveErr) => {
                if (saveErr) {
                    return res.status(500).json({
                        statusCode: 500,
                        success: false,
                        message: "Error saving session",
                    });
                }
                res.status(200).json({
                    statusCode: 200,
                    success: true,
                    message: "User logged in successfully",
                    data: userData,
                });
            });
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error logging in",
            error,
        });
    }
};
exports.login = login;
const verify = async (req, res) => {
    try {
        const user = req.session.user;
        if (user) {
            res.status(200).json({
                statusCode: 200,
                success: true,
                message: "User verified successfully",
                data: user,
            });
        }
        else {
            res.status(404).json({
                statusCode: 404,
                success: false,
                message: "User not found",
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error verifying user",
            error,
        });
    }
};
exports.verify = verify;
const logout = async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                statusCode: 500,
                success: false,
                message: "Error destroying session",
            });
        }
        res.clearCookie("connect.sid", {
            path: "/",
            httpOnly: true,
            secure: config_1.config.env === "production", // Only use secure cookies in production
            sameSite: "strict",
        });
        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Logged out successfully",
        });
    });
};
exports.logout = logout;
const verifyEmail = async (req, res) => {
    try {
        const id = req.params.id;
        const code = req.query.code;
        if (!id || !code) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: "Please provide all required fields",
            });
        }
        const user = await userModel_1.default.findById(id);
        // check if user exists
        if (!user) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "User not found",
            });
        }
        // if code is correct & expiration, if both are satisfied update emailVerifiedAt and status to active
        if (user.verification && user.verification.code === code && new Date() < user.verification.expiresAt) {
            const updated = await userModel_1.default.findByIdAndUpdate(id, {
                status: "active",
                emailVerifiedAt: new Date(),
            });
            res.status(200).json({
                statusCode: 200,
                success: true,
                message: "Email verified successfully",
                data: updated,
            });
        }
        else {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: "Invalid or expired verification code",
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error verifying email",
            error,
        });
    }
};
exports.verifyEmail = verifyEmail;
