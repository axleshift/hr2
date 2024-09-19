import pino from "pino";

const logger = pino({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  transport:
    process.env.NODE_ENV !== "production"
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
