import path from "path";
import dotenv from "dotenv";
dotenv.config();

export const config = {
    fileServer: {
        dir: path.join(__dirname, "public"),
        applicants: path.join(__dirname, "public/applicants"),
    },

    server: {
        host: "localhost",
        port: 5056,
        jwt: {
            secret: process.env.JWT_SECRET,
            expiry: "1h",
        },
        session: {
            secret: process.env.SESSION_SECRET,
            expiry: 24 * 60 * 60 * 1000, // 24 hours
        },
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
        dir: path.join(__dirname, "logs/express"),
    },

    route: {
        dir: path.join(__dirname, "routes"),
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
