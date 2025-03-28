/**
 * @file /middlewares/logger.ts
 * @description Middleware to log HTTP requests 
 */

import pino from "pino";
import { config } from "../config";

const logger = pino({
  level: config.env === "production" ? "info" : "debug",
  transport:
  {
    target: "pino-pretty",
    options: {
      colorize: true, // Colorize logs
      translateTime: true, // Add timestamps
      ignore: "pid,hostname", // Ignore process ID and hostname in logs
    },
  }
});

export default logger;
