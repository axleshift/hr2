import mongoose from "mongoose";
import Jobposter from "../models/jobposterModel";
import JobPosting from "../models/jobpostingModel";
import { createTweet, removeTweet } from "../../utils/twitter";
import logger from "../../middleware/logger";

/**
 * Creates a new job poster in the database and post the job posting to the specified platforms.
 *
 * @param req - The HTTP request object containing the job posting data.
 * @param res - The HTTP response object to send the result.
 * @param next - The next middleware function in the request-response cycle.
 * @returns A JSON response with the created job posting.
 */

const createJobposter = async (req: any, res: any) => {
  const ref_id = req.params.id;
  const contentFB = req.body.facebook;
  const contentTW = req.body.twitter;
  try {
    const jobposting = await JobPosting.findById(ref_id);
    if (!jobposting) {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        message: `Jobposting with id ${ref_id} not found`,
      });
    }

    const jobposterFB = new Jobposter({
      ref_id: ref_id,
      platform: "facebook",
      isPosted: false,
      post_id: "",
      content: contentFB,
      expiresAt: jobposting.schedule_end,
      status: "active",
    });

    const tweet = async (content: any) => {
      try {
        const tweet = content;
        const res: any = await createTweet(tweet);
        if (res.errors) {
          throw new Error(res.errors);
        }
        await JobPosting.findByIdAndUpdate(ref_id, {
          status: "active",
        });
        return res.data;
      } catch (error) {
        logger.error("Error posting tweet:", error);
        throw error;
      }
    };

    let jobposterTW;
    try {
      const tweetResponse = await tweet(contentTW);
      jobposterTW = new Jobposter({
        ref_id: ref_id,
        platform: "twitter",
        isPosted: true,
        post_id: tweetResponse.id,
        content: contentTW,
        expiresAt: jobposting.schedule_end,
        status: "active",
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        success: false,
        message: "Error posting to Twitter",
        error,
      });
    }

    // if (contentFB) await jobposterFB.save();
    if (contentTW) await jobposterTW.save();

    res.status(201).json({
      statusCode: 201,
      success: true,
      message: "Jobposting posted",
      data: {
        facebook: jobposterFB,
        twitter: jobposterTW,
      },
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Error posting jobposting",
      error,
    });
  }
};

const getJobposterById = async (req: any, res: any) => {
  const { id } = req.params;
  try {
    const jobposter = await Jobposter.find({
      ref_id: id,
      isPosted: true,
      status: "active",
    });
    if (!jobposter) {
      res.status(404).json({
        statusCode: 404,
        success: false,
        message: "Jobposter not found",
      });
    } else {
      res.status(200).json({
        statusCode: 200,
        message: "Jobposter found",
        data: jobposter,
      });
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Error getting jobposter",
      error,
    });
  }
};

const removeJobposter = async (req: any, res: any) => {
  const { id } = req.params;
  let ref_id;
  try {
    const jobposter = await Jobposter.findById(id);
    if (!jobposter) {
      res.status(404).json({
        statusCode: 404,
        success: false,
        message: "Jobposter not found",
      });
    } else {
      const tweet = async (post_id: any) => {
        try {
          const res: any = await removeTweet(post_id);

          if (res.errors) {
            return res;
          }
          return res;
        } catch (error) {
          logger.error("Error deleting tweet:", error);
          return error;
        }
      };
      await tweet(jobposter.post_id);
      await Jobposter.findByIdAndUpdate(id, {
        isPosted: false,
        status: "inactive",
      });

      // check if there are no more jobposters for the jobposting that is active and if none exist,
      // set the jobposting status to inactive
      const jobposters = await Jobposter.find({
        ref_id: jobposter.ref_id,
        status: "active",
      });
      if (jobposters.length === 0) {
        await JobPosting.findByIdAndUpdate(jobposter.ref_id, {
          status: "inactive",
        });
      }
      res.status(200).json({
        statusCode: 200,
        success: true,
        message: "Jobposter deleted",
      });
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Error deleting jobposter",
      error,
    });
  }
};

export { createJobposter, getJobposterById, removeJobposter };
