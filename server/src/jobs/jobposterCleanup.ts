import cron from "node-cron";
import Jobposter from "../database/models/jobposterModel";
import Jobposting from "../database/models/jobpostingModel";
import { removeTweet, createTweet } from "../utils/twitter";
import logger from "../middlewares/logger";
import { TweetType } from "../types/tweet";
import { JobposterType } from "../types/jobposter";
import { JobpostingType } from "../types/jobposting";

const now = new Date();

const fetchExpiredJobposters = async () => {
    const expiredJobposters = (await Jobposter.find({
        expiresAt: { $lt: now },
        status: "active",
    })) as JobposterType[];
    return expiredJobposters;
};

const fetchScheduledJobposters = async () => {
    const scheduledJobposters = (await Jobposter.find({
        postAt: { $lt: now },
    })) as JobposterType[];
    return scheduledJobposters;
};

const postApprovedJobposter = async () => {
    const jobposters = await fetchScheduledJobposters();
    for (const jobposter of jobposters) {
        try {
            const tweet = (await createTweet(jobposter.content)) as TweetType;
            await Jobposter.updateOne({ _id: jobposter._id }, { post_id: (tweet as TweetType).id_str, isPosted: true });
            const jobposting = (await Jobposting.findById(jobposter.ref_id)) as JobpostingType;
            await Jobposting.updateOne({ _id: jobposting._id }, { status: "active" });
        } catch (error) {
            logger.error(`Error posting tweet for jobposter ${jobposter._id}:`, error);
        }
    }
};

const updateExpiredJobposters = async (expiredJobposters: JobposterType[]) => {
    const updatedJobposters = await Jobposter.updateMany({ _id: { $in: expiredJobposters.map((jobposter) => jobposter._id) } }, { status: "expired" });
    return updatedJobposters;
};

const removeFromTwitter = async (expiredJobposters: JobposterType[]) => {
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
const jobposterCleanUp = () => {
    // Run every day at midnight
    cron.schedule("0 0 * * *", async () => {
        logger.info("Removing expired jobposters");
        try {
            const expiredJobposters = await fetchExpiredJobposters();
            logger.info(`Found ${expiredJobposters.length} expired jobposters`);
            if (expiredJobposters.length > 0) {
                await updateExpiredJobposters(expiredJobposters);
                logger.info("Expired jobposters updated");
                await removeFromTwitter(expiredJobposters);
                logger.info("Expired jobposters removed from Twitter");
                await postApprovedJobposter();
                logger.info("Approved jobposters posted to Twitter");
            }
        } catch (error) {
            logger.error("Error removing expired jobposters:", error);
        }
    });
};

export default jobposterCleanUp;
