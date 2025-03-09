/**
 * @file config.ts
 * @description Configuration file for the Node.js Express API
 */

import path from "path";
import dotenv from "dotenv";
dotenv.config();

export const config = {
  version: "1.0.0",
  name: "Node.js Express API",

  fileServer: {
    dir: path.join(__dirname, "public"),
    applicants: path.join(__dirname, "public/applicants"),
  },

  server: {
    host: process.env.SERVER_HOST,
    port: process.env.SERVER_PORT,
    csrfProtection: process.env.SERVER_CSRF,
    trustProxy: process.env.SERVER_TRUST_PROXY,
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

  api:{
    masterKey: process.env.API_MASTER_KEY,
  },

  google: {
    formsKey: process.env.GOOGLE_FORMS_KEY,
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
    dir: path.join(__dirname, "logs/express"),
    metrics: path.join(__dirname, "logs/metrics"),
  },

  prom: {
    metrics: {
      prefix: process.env.PROMETHEUS_METRICS_PREFIX,
      timeout: 5000,
    },
    activeSessions: {
      timeout: 10000,
    },
  },

  route: {
    dir: path.join(__dirname, "routes"),
    sessionExceptions: process.env.SESSION_EXCEPTIONS?.split(",") || ["auth"],
  },

  env: process.env.NODE_ENV || "development",
};
