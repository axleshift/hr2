"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeJobposter = exports.getJobposterByRefId = exports.createJobposter = void 0;
const jobposterModel_1 = __importDefault(require("../models/jobposterModel"));
const jobpostingModel_1 = __importDefault(require("../models/jobpostingModel"));
const twitter_1 = require("../../../utils/twitter");
const logger_1 = __importDefault(require("../../../middlewares/logger"));
/**
 * Creates a new job poster in the database and post the job posting to the specified platforms.
 *
 * @param req - The HTTP request object containing the job posting data.
 * @param res - The HTTP response object to send the result.
 * @param next - The next middleware function in the request-response cycle.
 * @returns A JSON response with the created job posting.
 */
const createJobposter = async (req, res) => {
    const ref_id = req.params.id;
    const contentFB = req.body.facebook;
    const contentTW = req.body.twitter;
    try {
        const jobposting = await jobpostingModel_1.default.findById(ref_id);
        if (!jobposting) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: `Jobposting with id ${ref_id} not found`,
            });
        }
        const jobposterFB = new jobposterModel_1.default({
            ref_id: ref_id,
            platform: "facebook",
            post_id: "",
            content: contentFB,
            expiresAt: jobposting.schedule_end,
            isPosted: false,
            isApproved: true,
            status: "active",
        });
        // will not be posting to twitter
        // const tweet = async (content: any) => {
        //   try {
        //     const tweet = content;
        //     const res: any = await createTweet(tweet);
        //     if (res.errors) {
        //       throw new Error(res.errors);
        //     }
        //     await JobPosting.findByIdAndUpdate(ref_id, {
        //       status: "active",
        //     });
        //     return res.data;
        //   } catch (error) {
        //     logger.error("Error posting tweet:", error);
        //     throw error;
        //   }
        // };
        let jobposterTW;
        try {
            // const tweetResponse = await tweet(contentTW);
            // logger.info("Tweet response:");
            // logger.info(tweetResponse);
            jobposterTW = new jobposterModel_1.default({
                ref_id: ref_id,
                platform: "twitter",
                post_id: "",
                content: contentTW,
                isPosted: false,
                isApproved: true,
                isDeleted: false,
                postAt: jobposting.schedule_start,
                expiresAt: jobposting.schedule_end,
                status: "active",
            });
        }
        catch (error) {
            return res.status(500).json({
                statusCode: 500,
                success: false,
                message: "Error creating jobposter",
                error,
            });
        }
        // if (contentFB) await jobposterFB.save();
        if (contentTW)
            await jobposterTW.save();
        res.status(201).json({
            statusCode: 201,
            success: true,
            message: "Jobposting posted",
            data: {
                facebook: jobposterFB,
                twitter: jobposterTW,
            },
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error posting jobposting",
            error,
        });
    }
};
exports.createJobposter = createJobposter;
const getJobposterByRefId = async (req, res) => {
    const { id } = req.params;
    try {
        const jobposter = await jobposterModel_1.default.find({
            ref_id: id,
        });
        if (!jobposter) {
            res.status(404).json({
                statusCode: 404,
                success: false,
                message: "Jobposter not found",
            });
        }
        else {
            res.status(200).json({
                statusCode: 200,
                success: true,
                message: "Jobposter found",
                data: jobposter,
            });
        }
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error getting jobposter",
            error,
        });
    }
};
exports.getJobposterByRefId = getJobposterByRefId;
const removeJobposter = async (req, res) => {
    const { id } = req.params;
    try {
        const jobposter = await jobposterModel_1.default.findById(id);
        if (!jobposter) {
            res.status(404).json({
                statusCode: 404,
                success: false,
                message: "Jobposter not found",
            });
        }
        else {
            const tweet = async (post_id) => {
                try {
                    const res = (await (0, twitter_1.removeTweet)(post_id));
                    console.log("Tweet response:");
                    console.log(res);
                    if (res.errors) {
                        return res;
                    }
                    return res;
                }
                catch (error) {
                    logger_1.default.error("Error deleting tweet:", error);
                    return error;
                }
            };
            if (jobposter.post_id) {
                await tweet(jobposter.post_id);
            }
            await jobposterModel_1.default.findByIdAndUpdate(id, {
                status: "inactive",
                isPosted: false,
                isDeleted: true,
            });
            // check if there are no more jobposters for the jobposting that is active and if none exist,
            // set the jobposting status to inactive
            const jobposters = await jobposterModel_1.default.find({
                ref_id: jobposter.ref_id,
                status: "active",
            });
            if (jobposters.length === 0) {
                await jobpostingModel_1.default.findByIdAndUpdate(jobposter.ref_id, {
                    status: "inactive",
                });
            }
            res.status(200).json({
                statusCode: 200,
                success: true,
                message: "Jobposter deleted",
            });
        }
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error deleting jobposter",
            error,
        });
    }
};
exports.removeJobposter = removeJobposter;
