"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const jobposterModel_1 = __importDefault(require("../database/v1/models/jobposterModel"));
const jobpostingModel_1 = __importDefault(require("../database/v1/models/jobpostingModel"));
const twitter_1 = require("../utils/twitter");
const logger_1 = __importDefault(require("../middlewares/logger"));
const now = new Date();
const fetchExpiredJobposters = async () => {
    const expiredJobposters = (await jobposterModel_1.default.find({
        expiresAt: { $lt: now },
        status: "active",
    }));
    return expiredJobposters;
};
const fetchScheduledJobposters = async () => {
    const scheduledJobposters = (await jobposterModel_1.default.find({
        postAt: { $lt: now },
    }));
    return scheduledJobposters;
};
const postApprovedJobposter = async () => {
    const jobposters = await fetchScheduledJobposters();
    for (const jobposter of jobposters) {
        try {
            const tweet = (await (0, twitter_1.createTweet)(jobposter.content));
            await jobposterModel_1.default.updateOne({ _id: jobposter._id }, { post_id: tweet.id_str, isPosted: true });
            const jobposting = (await jobpostingModel_1.default.findById(jobposter.ref_id));
            await jobpostingModel_1.default.updateOne({ _id: jobposting._id }, { status: "active" });
        }
        catch (error) {
            logger_1.default.error(`Error posting tweet for jobposter ${jobposter._id}:`, error);
        }
    }
};
const updateExpiredJobposters = async (expiredJobposters) => {
    const updatedJobposters = await jobposterModel_1.default.updateMany({ _id: { $in: expiredJobposters.map((jobposter) => jobposter._id) } }, { status: "expired" });
    return updatedJobposters;
};
const removeFromTwitter = async (expiredJobposters) => {
    for (const jobposter of expiredJobposters) {
        if (jobposter.platform === "twitter") {
            try {
                await (0, twitter_1.removeTweet)(jobposter.post_id);
            }
            catch (error) {
                logger_1.default.error(`Error removing tweet ${jobposter.post_id}:`, error);
            }
        }
    }
};
// Remove expired jobposters every 24 hours
const jobposterCleanUp = () => {
    // Run every day at midnight
    node_cron_1.default.schedule("0 0 * * *", async () => {
        logger_1.default.info("Removing expired jobposters");
        try {
            const expiredJobposters = await fetchExpiredJobposters();
            logger_1.default.info(`Found ${expiredJobposters.length} expired jobposters`);
            if (expiredJobposters.length > 0) {
                await updateExpiredJobposters(expiredJobposters);
                logger_1.default.info("Expired jobposters updated");
                await removeFromTwitter(expiredJobposters);
                logger_1.default.info("Expired jobposters removed from Twitter");
                await postApprovedJobposter();
                logger_1.default.info("Approved jobposters posted to Twitter");
            }
        }
        catch (error) {
            logger_1.default.error("Error removing expired jobposters:", error);
        }
    });
};
exports.default = jobposterCleanUp;
