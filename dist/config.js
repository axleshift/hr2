"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    fileServer: {
        dir: path_1.default.join(__dirname, "public"),
        applicants: path_1.default.join(__dirname, "public/applicants"),
    },
    server: {
        host: process.env.SERVER_HOST,
        port: process.env.SERVER_PORT,
        jwt: {
            secret: process.env.JWT_SECRET,
            expiry: "1h",
        },
        session: {
            secret: process.env.SESSION_SECRET,
            expiry: 24 * 60 * 60 * 1000, // 24 hours
        },
        origins: ["http://localhost:3000", "http://localhost:8000", "http://localhost:5056", "http://localhost:4173", "https://hr2.axleshift.com/"],
    },
    mongoDB: {
        username: process.env.MONGODB_USERNAME,
        password: process.env.MONGODB_PASSWORD,
        cluster: process.env.MONGODB_CLUSTER,
        options: process.env.MONGODB_OPTIONS,
        uri: `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}/?${process.env.MONGODB_OPTIONS}`,
    },
    twitterApi: {
        key: process.env.TWITTER_API_KEY,
        secret: process.env.TWITTER_API_SECRET,
        accessToken: process.env.TWITTER_ACCESS_TOKEN,
        accessSecret: process.env.TWITTER_ACCESS_SECRET,
    },
    logging: {
        dir: path_1.default.join(__dirname, "logs/express"),
    },
    route: {
        dir: path_1.default.join(__dirname, "routes"),
        sessionExceptions: ["auth"],
    },
    env: process.env.NODE_ENV || "development",
    // logFolder: path.join(__dirname, "logs/express"),
    // routeFolder: path.join(__dirname, "routes"),
    // sessionExceptions: ["auth"],
    // env: {
    //     environment: process.env.NODE_ENV || "development", // development, production, test
    //     port: process.env.SERVER_PORT, // Port to run the server on
    //     sessionSecret: process.env.SESSION_SECRET || "", // Secret for session
    //     jwtSecret: process.env.JWT_SECRET || "", // Secret for JWT
    //     mongoDbUri: process.env.MONGODB_URI || "",
    // },
    // resumes: {
    //     defaultExpiry: 30, // in days
    // },
};
