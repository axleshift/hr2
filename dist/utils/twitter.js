"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeTweet = exports.createTweet = void 0;
const twitter_api_v2_1 = require("twitter-api-v2");
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = __importDefault(require("../middlewares/logger"));
dotenv_1.default.config();
const client = new twitter_api_v2_1.TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET_KEY,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});
const createTweet = async (content) => {
    try {
        const res = await client.v2.tweet(content);
        if (res.errors) {
            logger_1.default.error("Error posting tweet:", res.errors);
            return res.errors;
        }
        logger_1.default.info("Tweet posted successfully");
        return res;
    }
    catch (error) {
        logger_1.default.error("Error posting tweet:", error);
        return error;
    }
};
exports.createTweet = createTweet;
const removeTweet = async (id) => {
    try {
        await client.v2.deleteTweet(id);
        logger_1.default.info("Tweet deleted successfully");
    }
    catch (error) {
        logger_1.default.error("Error deleting tweet:", error);
        return error;
    }
};
exports.removeTweet = removeTweet;
