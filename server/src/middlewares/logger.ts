import pino from "pino";
import { config } from "../config";

const logger = pino({
    level: config.env.environment === "production" ? "info" : "debug",
    transport:
        config.env.environment !== "production"
            ? {
                  target: "pino-pretty",
                  options: {
                      colorize: true, // Colorize logs
                      translateTime: true, // Add timestamps
                      ignore: "pid,hostname", // Ignore process ID and hostname in logs
                  },
              }
            : undefined, // No transport in production
});

export default logger;
