import logger from "../../middlewares/logger";
import interviewSchedModel from "../models/interviewSchedModel";
import interviewTimeSlotModel from "../models/interviewTimeSlotModel";
import { Request as req, Response as res } from "express";

export const getInterviewForADay = async (req: req, res: res) => {
    try {
        logger.info("Getting all interviews for a day");
        logger.info(req.query);
        const date = typeof req.query.date === "string" ? req.query.date : new Date().toISOString();
        const page = typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
        const limit = typeof req.query.limit === "string" ? parseInt(req.query.limit) : 9;
        const skip = (page - 1) * limit;
        const total = await interviewSchedModel.countDocuments();

        if (total === 0) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "No interviews found",
            });
        }

        logger.info("Getting all interviews for a day");
        logger.info(date);

        const startDate = new Date(date).setHours(0, 0, 0, 0);
        const endDate = new Date(startDate).setDate(new Date(startDate).getDate() + 1);

        const interviews = await interviewSchedModel
            .find({
                date: {
                    $gte: startDate,
                    $lt: endDate,
                },
            })
            .skip(skip)
            .limit(limit)
            .sort({ date: 1 });

        const allSlots = await interviewTimeSlotModel.find({
            date: {
                $gte: startDate,
                $lt: endDate,
            },
        });

        if (interviews.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: `No interviews found for ${date}`,
            });
        }

        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Interviews retrieved successfully",
            data: interviews,
            slots: allSlots,
            total: total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        });
    } catch (error) {
        logger.info(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error retrieving interviews",
            error,
        });
    }
};

export const getInterviewForAMonth = async (req: req, res: res) => {
    const { year, month } = req.params;
    try {
        const interviews = await interviewSchedModel.find({
            $expr: {
                $and: [{ $eq: [{ $year: "$date" }, parseInt(year)] }, { $eq: [{ $month: "$date" }, parseInt(month)] }],
            },
        });

        logger.info(interviews);

        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Interviews retrieved successfully",
            interviews: interviews,
        });
    } catch (error) {
        logger.error(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error retrieving interviews",
            error,
        });
    }
};

export const getInterviewById = async (req: req, res: res) => {
    const { id } = req.params;
    try {
        const interview = await interviewSchedModel.findById(id);

        if (!interview || interview === null) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "Interview not found",
            });
        }

        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Interview retrieved successfully",
            data: interview,
        });
    } catch (error) {
        logger.error(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error retrieving interview",
            error,
        });
    }
};


export const createInterviewForADate = async (req: req, res: res) => {
    try {
        const date = req.body.date;
        const timeslotRef_id = req.body.timeslotId; // ID of the timeslot
        const title = req.body.title;
        const additionalInfo = req.body.additionalInfo;
        const location = req.body.location;

        const parsedDate = new Date(date).setUTCHours(0, 0, 0, 0);

        if (!timeslotRef_id || !title) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: "Missing required fields",
            });
        }

        // Create the interview
        const interview = new interviewSchedModel({
            date: parsedDate,
            title,
            timeslotRef_id,
            additionalInfo: additionalInfo || null,
            location: location || null,
            isActive: true,
            isExpired: false,
        });

        // Update the timeslot to be unavailable
        const timeslot = await interviewTimeSlotModel.findByIdAndUpdate(
            timeslotRef_id,
            {
                isAvailable: false,
            },
            { new: true }
        );

        if (!timeslot) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "Timeslot not found",
            });
        }

        await interview.save();
        await timeslot.save();
        res.status(201).json({
            statusCode: 201,
            success: true,
            message: "Interview created and timeslot updated successfully",
            data: interview,
        });
    } catch (error) {
        logger.error(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "An error occurred",
            error: error,
        });
    }
};

export const updateInterview = async (req: req, res: res) => {
    try {
        const date = req.body.date;
        const timeslotRef_id = req.body.timeslotId; // ID of the timeslot
        const title = req.body.title;
        const additionalInfo = req.body.additionalInfo;
        const location = req.body.location;

        const parsedDate = new Date(date).setUTCHours(0, 0, 0, 0);

        if (!timeslotRef_id || !title || !date) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: "Missing required fields",
            });
        }

        // find the interview data, extract the previous timeslot id then update the timeslot to be available
        const prevInterview = await interviewSchedModel.findById(req.params.id);
        if (!prevInterview) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "Previous interview not found",
            });
        }
        const prevTimeslotId = prevInterview.timeslotRef_id;
        const timeslot = await interviewTimeSlotModel.findByIdAndUpdate(
            prevTimeslotId,
            {
                isAvailable: true,
            },
            { new: true }
        );

        if (!timeslot) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "Timeslot not found",
            });
        }

        // Update the interview
        await interviewSchedModel.findByIdAndUpdate(
            req.params.id,
            {
                date: parsedDate,
                title,
                timeslotRef_id,
                additionalInfo: additionalInfo || null,
                location: location || null,
                isActive: true,
                isExpired: false,
            },
            { new: true }
        );

        await timeslot.save();
    } catch (error) {
        logger.error(error);
    }
};

export const deleteInterview = async (req: req, res: res) => {
    try {
        const id = req.params.id;
        const interview = await interviewSchedModel.findById(id);
        if (!interview) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "Interview not found",
            });
        }

        const timeslot = await interviewTimeSlotModel.findByIdAndUpdate(
            interview.timeslotRef_id,
            {
                isAvailable: true,
            },
            { new: true }
        );

        if (!timeslot) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "Timeslot not found",
            });
        }

        await interview.deleteOne();
        await timeslot.save();
        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Interview deleted successfully",
        });
    } catch (error) {
        logger.error(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "An error occurred",
            error: error,
        });
    }
};
