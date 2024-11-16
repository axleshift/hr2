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
    version: "1.0.0",
    name: "Node.js Express API",
    fileServer: {
        dir: path_1.default.join(__dirname, "public"),
        applicants: path_1.default.join(__dirname, "public/applicants"),
    },
    server: {
        host: process.env.SERVER_HOST,
        port: process.env.SERVER_PORT,
        jwt: {
            secret: process.env.JWT_SECRET,
            expiry: process.env.JWT_EXPIRES_IN,
        },
        session: {
            secret: process.env.SESSION_SECRET,
            expiry: 24 * 60 * 60 * 1000,
        },
        origins: process.env.CORS_ORIGINS?.split(",") || [],
    },
    mongoDB: {
        username: process.env.MONGODB_USERNAME,
        password: process.env.MONGODB_PASSWORD,
        cluster: process.env.MONGODB_CLUSTER,
        options: process.env.MONGODB_OPTIONS,
        uri: `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}/?${process.env.MONGODB_OPTIONS}`,
        ttl: 24 * 60 * 60, // 1 day
    },
    twitterApi: {
        key: process.env.TWITTER_API_KEY,
        secret: process.env.TWITTER_API_SECRET,
        accessToken: process.env.TWITTER_ACCESS_TOKEN,
        accessSecret: process.env.TWITTER_ACCESS_SECRET,
    },
    logging: {
        dir: path_1.default.join(__dirname, "logs/express"),
        metrics: path_1.default.join(__dirname, "logs/metrics"),
    },
    prom: {
        metrics: {
            prefix: "nodejs_",
            timeout: 5000,
        },
        activeSessions: {
            timeout: 10000,
        }
    },
    route: {
        dir: path_1.default.join(__dirname, "routes"),
        sessionExceptions: process.env.SESSION_EXCEPTIONS?.split(",") || ["auth"],
    },
    env: process.env.NODE_ENV || "development",
};
