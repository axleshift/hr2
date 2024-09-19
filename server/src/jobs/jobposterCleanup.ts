import cron from "node-cron";
import Jobposter from "../database/models/jobposterModel";
import { removeTweet } from "../utils/twitter";
import logger from "../middleware/logger";

const now = new Date();

const fetchExpiredJobposters = async () => {
  const expiredJobposters = await Jobposter.find({
    expiresAt: { $lt: now },
    status: "active",
  });
  return expiredJobposters;
};

const updateExpiredJobposters = async (expiredJobposters: any) => {
  const updatedJobposters = await Jobposter.updateMany(
    { _id: { $in: expiredJobposters.map((jobposter: any) => jobposter._id) } },
    { status: "expired" }
  );
  return updatedJobposters;
};

const removeFromTwitter = async (expiredJobposters: any) => {
  for (const jobposter of expiredJobposters) {
    if (jobposter.platform === "twitter") {
      try {
        await removeTweet(jobposter.post_id);
      } catch (error) {
        logger.error(`Error removing tweet ${jobposter.post_id}:`, error);
      }
    }
  }
};

// Remove expired jobposters every 24 hours
const removeExpiredJobposters = () => {
  // Run every day at midnight
  cron.schedule("0 0 * * *", async () => {
    logger.info("Removing expired jobposters");
    try {
      const expiredJobposters = await fetchExpiredJobposters();
      logger.info(`Found ${expiredJobposters.length} expired jobposters`);
      if (expiredJobposters.length > 0) {
        await updateExpiredJobposters(expiredJobposters);
        await removeFromTwitter(expiredJobposters);
        logger.info("Expired jobposters removed");
      }
    } catch (error) {
      logger.error("Error removing expired jobposters:", error);
    }
  });
};

export default removeExpiredJobposters;
