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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
            if (module.default?.metadata && typeof module.default.run === "function") {
                logger_1.default.info(`Running seed: ${module.default.metadata.name}`);
                logger_1.default.info(`Description: ${module.default.metadata.description}`);
                await module.default.run();
            }
            else {
                logger_1.default.warn(`Invalid seed file: ${module.default}`);
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
