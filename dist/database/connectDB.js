"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../config");
const logger_1 = __importDefault(require("../middlewares/logger"));
const dbConnection = async () => {
    try {
        await mongoose_1.default.connect(config_1.config.mongoDB.uri);
        return true;
    }
    catch (error) {
        logger_1.default.error(error);
        return false;
    }
};
// loop till db is connected
const connectDB = async () => {
    let connected = false;
    logger_1.default.info("🙏 Attempting to connect to MongoDB");
    while (!connected) {
        connected = await dbConnection();
    }
    if (connected) {
        logger_1.default.info("🌿 Connected to MongoDB");
    }
};
exports.connectDB = connectDB;
