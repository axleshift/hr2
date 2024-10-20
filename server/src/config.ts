import path from "path";
import dotenv from "dotenv";
dotenv.config();
export const config = {
    fileServer: {
        dir: path.join(__dirname, "public"),
        applicants: path.join(__dirname, "public/applicants"),
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
        sessionExceptions: process.env.SESSION_EXCEPTIONS?.split(",") || ["auth"],
    },

    env: process.env.NODE_ENV || "development",
};
