"use strict";
/**
 * @file config.ts
 * @description Configuration file for the Node.js Express API
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
exports.config = {
    version: "1.0.0",
    name: "Node.js Express API",
    fileServer: {
        dir: path_1.default.join(__dirname, "public"),
        applicants: path_1.default.join(__dirname, "public/applicants"),
    },
    server: {
        host: process.env.SERVER_HOST,
        port: process.env.SERVER_PORT || 8000,
        csrfProtection: process.env.SERVER_CSRF,
        trustProxy: process.env.SERVER_TRUST_PROXY,
        jwt: {
            secret: process.env.JWT_SECRET,
            expiry: process.env.JWT_EXPIRES_IN,
        },
        session: {
            httpOnly: process.env.SESSION_HTTP_ONLY || true,
            secret: process.env.SESSION_SECRET,
            expiry: 24 * 60 * 60 * 1000, // 1 day
        },
        origins: process.env.CORS_ORIGINS?.split(",") || [],
    },
    api: {
        masterKey: process.env.API_MASTER_KEY,
        hr1Key: process.env.API_HR1_KEY,
        adminKey: process.env.API_ADMIN_KEY,
    },
    google: {
        key: process.env.GOOGLE_FORMS_KEY,
        oauth2: {
            id: process.env.GOOGLE_CLIENT_ID,
            secret: process.env.GOOGLE_CLIENT_SECRET,
            redirectURI: process.env.GOOGLE_REDIRECT_URI,
            clientRedirect: process.env.GOOGLE_CLIENT_REDIRECT,
        },
        smtp: {
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_SECURE || true,
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
            tls: process.env.SMTP_TLS,
        }
    },
    anthropic: {
        key: process.env.ANTHROPIC_KEY,
    },
    mongoDB: {
        username: process.env.MONGODB_USERNAME,
        password: process.env.MONGODB_PASSWORD,
        cluster: process.env.MONGODB_CLUSTER,
        options: process.env.MONGODB_OPTIONS,
        // if NODE_ENV is production, use the MONGODB_URI, otherwise use the connection string
        uri: process.env.NODE_ENV === "development" ? process.env.MONGODB_URI : (process.env.MONGODB_URI || `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}/?${process.env.MONGODB_OPTIONS}`),
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
            prefix: process.env.PROMETHEUS_METRICS_PREFIX,
            timeout: 5000,
        },
        activeSessions: {
            timeout: 10000,
        },
        key: process.env.PROMETHEUS_METRICS_KEY,
    },
    route: {
        dir: path_1.default.join(__dirname, "routes"),
        sessionExceptions: process.env.SESSION_EXCEPTIONS?.split(",") || [],
    },
    env: process.env.NODE_ENV || "development",
};
