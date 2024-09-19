import { TwitterApi } from "twitter-api-v2";

import dotenv from "dotenv";
import logger from "../middleware/logger";
dotenv.config();

const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET_KEY,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});
const readOnlyClient = client.readOnly;

const formatSalary = (number: number) => {
  return number.toLocaleString("en-US", {
    style: "currency",
    currency: "PHP",
  });
};

const createTweet = async (content: string) => {
  try {
    const res = await client.v2.tweet(content);
    if (res.errors) {
      logger.error("Error posting tweet:", res.errors);
      return res.errors;
    }
    logger.info("Tweet posted successfully");
    return res;
  } catch (error) {
    logger.error("Error posting tweet:", error);
    return error;
  }
};

const removeTweet = async (id: string) => {
  try {
    await client.v2.deleteTweet(id);
    logger.info("Tweet deleted successfully");
  } catch (error) {
    logger.error("Error deleting tweet:", error);
    return error;
  }
};

export { createTweet, removeTweet };
