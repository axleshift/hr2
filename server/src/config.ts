import path from "path";
import dotenv from "dotenv";
dotenv.config();

export const config = {
  filerServer: {
    port: 5000,
  },
  logFolder: path.join(__dirname, "logs/express"),
  exposeDir: path.join(__dirname, "public"),
  routeFolder: path.join(__dirname, "routes"),
  sessionExceptions: ["login", "register", "check-auth"],

  env: {
    environment: process.env.NODE_ENV || "development",
    port: process.env.PORT || 8000,
    sessionSecret: process.env.SESSION_SECRET || "",
  },
};
