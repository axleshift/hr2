"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logger_1 = __importDefault(require("../../../middlewares/logger"));
const connectDB_1 = require("../../connectDB");
const mongoose_1 = __importDefault(require("mongoose"));
const currentDir = __dirname;
(0, connectDB_1.connectDB)();
const seedFiles = fs_1.default.readdirSync(currentDir).filter((file) => {
    return ((file.endsWith(".ts") && file !== "index.js") || file.endsWith(".js")) && file !== "index.ts";
});
const seedModules = seedFiles.map((file) => {
    const modulePath = path_1.default.join(currentDir, file);
    return Promise.resolve(`${modulePath}`).then(s => __importStar(require(s)));
});
const runSeeds = async () => {
    try {
        const modules = await Promise.all(seedModules);
        for (const module of modules) {
            if (typeof module.default === "function") {
                logger_1.default.info(`Running seed: ${module.default.name}`);
                await module.default();
            }
            else {
                logger_1.default.warn(`No default function found in ${module.default}`);
            }
        }
        logger_1.default.info("All seeds ran successfully");
        mongoose_1.default.connection.close();
    }
    catch (error) {
        logger_1.default.error("Error running seeds:", error);
        mongoose_1.default.connection.close();
    }
};
runSeeds();
