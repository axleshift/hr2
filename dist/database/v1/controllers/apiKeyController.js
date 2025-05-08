"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApikey = exports.updateApikey = exports.generateApikey = void 0;
const apikeyModel_1 = __importDefault(require("../models/apikeyModel"));
const logger_1 = __importDefault(require("../../../middlewares/logger"));
const generateApikey = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: "User not authenticated",
            });
        }
        const userId = req.session.user?._id;
        const apiKeyData = await apikeyModel_1.default.find({ owner: userId });
        return res.status(200).json({
            statusCode: 200,
            success: true,
            data: apiKeyData,
        });
    }
    catch (error) {
        logger_1.default.error(error);
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Internal server error",
        });
    }
};
exports.generateApikey = generateApikey;
const updateApikey = async (req, res) => {
    try {
        const { permissions, expiresAt } = req.body;
        const { id } = req.params;
        const apiKeyData = await apikeyModel_1.default.findById(id);
        if (!apiKeyData) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "API key not found",
            });
        }
        apiKeyData.permissions = permissions;
        apiKeyData.expiresAt = expiresAt;
        await apiKeyData.save();
        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "API key updated successfully",
        });
    }
    catch (error) {
        logger_1.default.error(error);
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Internal server error",
        });
    }
};
exports.updateApikey = updateApikey;
const createApikey = async (req, res) => {
    try {
        const { permissions, expiresAt } = req.body;
        const key = Math.random().toString(36).substring(7);
        const userId = req.session.user?._id;
        const apiKeyData = await apikeyModel_1.default.create({
            key: key,
            owner: req.session.user ? userId : undefined,
            permissions: permissions || [],
            expiresAt: expiresAt || new Date(),
        });
        return res.status(201).json({
            statusCode: 201,
            success: true,
            message: "API key created successfully",
            data: apiKeyData,
        });
    }
    catch (error) {
        logger_1.default.error(error);
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Internal server error",
        });
    }
};
exports.createApikey = createApikey;
