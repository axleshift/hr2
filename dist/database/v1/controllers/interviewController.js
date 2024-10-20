"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteInterview = exports.updateInterview = exports.createInterviewForADate = exports.getInterviewById = exports.getInterviewForAMonth = exports.getInterviewForADay = void 0;
const logger_1 = __importDefault(require("../../../middlewares/logger"));
const interviewSchedModel_1 = __importDefault(require("../models/interviewSchedModel"));
const interviewTimeSlotModel_1 = __importDefault(require("../models/interviewTimeSlotModel"));
const getInterviewForADay = async (req, res) => {
    try {
        logger_1.default.info("Getting all interviews for a day");
        logger_1.default.info(req.query);
        const date = typeof req.query.date === "string" ? req.query.date : new Date().toISOString();
        const page = typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
        const limit = typeof req.query.limit === "string" ? parseInt(req.query.limit) : 9;
        const skip = (page - 1) * limit;
        const total = await interviewSchedModel_1.default.countDocuments();
        if (total === 0) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "No interviews found",
            });
        }
        const startDate = new Date(date).setHours(0, 0, 0, 0);
        const endDate = new Date(startDate).setDate(new Date(startDate).getDate() + 1);
        const interviews = await interviewSchedModel_1.default
            .find({
            date: {
                $gte: startDate,
                $lt: endDate,
            },
        })
            .skip(skip)
            .limit(limit)
            .sort({ date: 1 });
        const allSlots = await interviewTimeSlotModel_1.default.find({
            date: {
                $gte: startDate,
                $lt: endDate,
            },
        });
        // parse slots to replace timeslotRef_id with timeslot data
        const parsedInterviews = interviews.map(async (interview) => {
            const timeslot = await interviewTimeSlotModel_1.default.findById(interview.timeslotRef_id);
            return {
                ...interview.toObject(),
                timeslot: timeslot,
            };
        });
        const interviewsWithSlots = await Promise.all(parsedInterviews);
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
            data: interviewsWithSlots,
            slots: allSlots,
            total: total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        });
    }
    catch (error) {
        logger_1.default.info(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error retrieving interviews",
            error,
        });
    }
};
exports.getInterviewForADay = getInterviewForADay;
const getInterviewForAMonth = async (req, res) => {
    const { year, month } = req.params;
    try {
        const interviews = await interviewSchedModel_1.default.find({
            $expr: {
                $and: [{ $eq: [{ $year: "$date" }, parseInt(year)] }, { $eq: [{ $month: "$date" }, parseInt(month)] }],
            },
        });
        logger_1.default.info(interviews);
        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Interviews retrieved successfully",
            interviews: interviews,
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error retrieving interviews",
            error,
        });
    }
};
exports.getInterviewForAMonth = getInterviewForAMonth;
const getInterviewById = async (req, res) => {
    const { id } = req.params;
    try {
        const interview = await interviewSchedModel_1.default.findById(id);
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
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error retrieving interview",
            error,
        });
    }
};
exports.getInterviewById = getInterviewById;
const createInterviewForADate = async (req, res) => {
    try {
        // const date = req.body.date;
        // const timeslotRef_id = req.body.timeslotId; // ID of the timeslot
        // const title = req.body.title;
        // const additionalInfo = req.body.additionalInfo;
        // const location = req.body.location;
        // const capacity = req.body.capacity;
        const { date, title, timeslotRef_id, additionalInfo, location, capacity } = req.body;
        const parsedDate = new Date(date).setUTCHours(0, 0, 0, 0);
        if (!timeslotRef_id || !title) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: "Missing required fields",
            });
        }
        // Create the interview
        const interview = new interviewSchedModel_1.default({
            date: parsedDate,
            title,
            timeslotRef_id,
            additionalInfo: additionalInfo,
            location: location,
            capacity: capacity,
            isActive: true,
            isExpired: false,
        });
        // Update the timeslot to be unavailable
        const timeslot = await interviewTimeSlotModel_1.default.findByIdAndUpdate(timeslotRef_id, {
            isAvailable: false,
        }, { new: true });
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
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "An error occurred",
            error: error,
        });
    }
};
exports.createInterviewForADate = createInterviewForADate;
const updateInterview = async (req, res) => {
    try {
        const id = req.params.id;
        const interview = await interviewSchedModel_1.default.findById(id);
        if (!interview) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "Interview not found",
            });
        }
        const { date, title, timeslotRef_id, additionalInfo, location, capacity } = req.body;
        const parsedDate = new Date(date).setUTCHours(0, 0, 0, 0);
        const formerTimeslot = await interviewTimeSlotModel_1.default.findByIdAndUpdate(interview.timeslotRef_id, {
            isAvailable: true,
        }, { new: true });
        if (!formerTimeslot) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "Timeslot not found",
            });
        }
        // Update the interview
        const updatedInterview = await interviewSchedModel_1.default.findByIdAndUpdate(id, {
            date: parsedDate,
            title,
            timeslotRef_id,
            additionalInfo,
            location,
            capacity,
        }, { new: true });
        if (!updatedInterview) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "Interview not found",
            });
        }
        // Update the timeslot to be unavailable
        const timeslot = await interviewTimeSlotModel_1.default.findByIdAndUpdate(timeslotRef_id, {
            isAvailable: false,
        }, { new: true });
        if (!timeslot) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "Timeslot not found",
            });
        }
        await updatedInterview.save();
        await timeslot.save();
        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Interview updated successfully",
            data: updatedInterview,
            formerTimeslot,
        });
    }
    catch (error) {
        logger_1.default.error(error);
    }
};
exports.updateInterview = updateInterview;
const deleteInterview = async (req, res) => {
    try {
        const id = req.params.id;
        const interview = await interviewSchedModel_1.default.findById(id);
        if (!interview) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "Interview not found",
            });
        }
        const timeslot = await interviewTimeSlotModel_1.default.findByIdAndUpdate(interview.timeslotRef_id, {
            isAvailable: true,
        }, { new: true });
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
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "An error occurred",
            error: error,
        });
    }
};
exports.deleteInterview = deleteInterview;
