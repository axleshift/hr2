"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.verify = exports.login = exports.createUser = void 0;
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
    const { firstname, lastname, email, username, password, status, role } = req.body;
    if (!firstname || !lastname || !email || !username || !password || !status || !role) {
        return res.status(400).json({
            statusCode: 400,
            success: false,
            message: "Please provide all required fields",
        });
    }
    try {
        const user = await userModel_1.default.create({
            firstname: await (0, hasher_1.hasher)(firstname, salt),
            lastname: await (0, hasher_1.hasher)(lastname, salt),
            email,
            username,
            password: await (0, hasher_1.hasher)(password, salt),
            rememberToken: salt,
            status,
            role,
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
                error: "User not found",
            });
        }
        const storedHashedPassword = user.password;
        const isPasswordValid = bcryptjs_1.default.compareSync(password, storedHashedPassword);
        if (!isPasswordValid) {
            return res.status(401).json({
                statusCode: 401,
                success: false,
                message: "Invalid credentials",
            });
        }
        const jwtSecret = config_1.config.server.jwt.secret;
        const token = jsonwebtoken_1.default.sign({ username, password }, jwtSecret, {
            expiresIn: "1h",
        });
        const data = {
            username: user.username,
            role: user.role,
            email: user.email,
            status: user.status,
            token: token,
        };
        req.session.user = data;
        req.session.save((err) => {
            if (err) {
                return res.status(500).json({
                    statusCode: 500,
                    success: false,
                    message: "Error saving session",
                });
            }
            res.status(200).json({
                statusCode: 200,
                success: true,
                message: "User verified successfully",
                data,
            });
        });
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
                error: err,
            });
        }
        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Session destroyed successfully",
        });
    });
};
exports.logout = logout;
