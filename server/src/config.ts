import path from "path";
import dotenv from "dotenv";
dotenv.config();

const config = {
  filerServer: {
    port: 5000,
  },
  logFolder: path.join(__dirname, "logs/express"),
  exposeDir: path.join(__dirname, "public"),
  routeFolder: path.join(__dirname, "routes"),
  sessionExceptions: ["login", "register", "check-auth"], // Routes that don't require authentication
  mongoDbUri: process.env.MONGODB_URI || "",

  env: {
    environment: process.env.NODE_ENV || "development", // development, production, test
    port: process.env.PORT || 8000, // Port to run the server on
    sessionSecret: process.env.SESSION_SECRET || "", // Secret for session
  },

  resumes: {
    defaultExpiry: 30, // in days
    fsDir: path.join(__dirname, "public/uploads"), // Filesystem directory
  },
};

export { config };
