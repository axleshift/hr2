import path from "path";
import dotenv from "dotenv";
dotenv.config();

const config = {
    fileServer: {
        dir: path.join(__dirname, "public"),
        applicants: path.join(__dirname, "public/applicants"),
    },
    logFolder: path.join(__dirname, "logs/express"),
    routeFolder: path.join(__dirname, "routes"),
    sessionExceptions: ["auth"], // Routes that don't require authentication
    mongoDbUri: process.env.MONGODB_URI || "",

    env: {
        environment: process.env.NODE_ENV || "development", // development, production, test
        port: process.env.PORT, // Port to run the server on
        sessionSecret: process.env.SESSION_SECRET || "", // Secret for session
        jwtSecret: process.env.JWT_SECRET || "", // Secret for JWT
    },

    resumes: {
        defaultExpiry: 30, // in days
    },
};

export { config };
