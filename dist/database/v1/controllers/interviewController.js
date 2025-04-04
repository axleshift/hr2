"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllRecentInterviews = exports.getAllInterview = exports.getInterviewById = exports.updateInterview = exports.createInterview = void 0;
const logger_1 = __importDefault(require("../../../middlewares/logger"));
const applicantModel_1 = __importDefault(require("../models/applicantModel"));
const interviewFormModel_1 = __importDefault(require("../models/interviewFormModel"));
const facilityEventModel_1 = __importDefault(require("../models/facilityEventModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const createInterview = async (req, res) => {
    try {
        const { applicantId, eventId } = req.params;
        const data = req.body;
        // Guard clause for missing applicantId
        if (!applicantId) {
            return res.status(400).json({ message: "Applicant ID is required", applicantId });
        }
        // Find the applicant by ID
        const applicant = await applicantModel_1.default.findById(applicantId);
        if (!applicant) {
            return res.status(404).json({ message: "Applicant not found", applicantId });
        }
        // Guard clause for missing eventId
        if (!eventId) {
            return res.status(400).json({ message: "Event ID is required", eventId });
        }
        const event = await facilityEventModel_1.default.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found", eventId });
        }
        // Get the interviewer ID from the session
        const interviewerId = req.session.user?._id;
        if (!interviewerId) {
            return res.status(400).json({ message: "Interviewer ID is required" });
        }
        // Guard clause for missing interview data
        if (!data) {
            return res.status(400).json({ message: "Interview data is required" });
        }
        // Guard clause for missing required fields
        if (!data.date || !data.type || !data.recommendation) {
            return res.status(400).json({ message: "Missing required fields in interview data" });
        }
        // Guard clause for missing or invalid 'general' field
        if (!data.general || !Object.keys(data.general).length) {
            return res.status(400).json({ message: "General ratings are required" });
        }
        // Validate ratings in 'general' field (optional, based on your rating scale)
        const ratingFields = ['communication', 'technical', 'problemSolving', 'culturalFit', 'workExperienceRelevance', 'leadership'];
        for (const field of ratingFields) {
            if (typeof data.general[field] !== 'number' || data.general[field] < 1 || data.general[field] > 5) {
                return res.status(400).json({ message: `Invalid rating for ${field}. Ratings should be between 1 and 5` });
            }
        }
        // Create the interview record
        const newData = {
            applicant: new mongoose_1.default.Types.ObjectId(applicantId),
            job: data.job,
            date: data.date,
            interviewer: new mongoose_1.default.Types.ObjectId(interviewerId),
            type: data.type,
            event: new mongoose_1.default.Types.ObjectId(eventId),
            general: data.general,
            questions: data.questions || [],
            salaryExpectation: data.salaryExpectation,
            strength: data.strength || '',
            weakness: data.weakness || '',
            recommendation: data.recommendation,
            finalComments: data.finalComments || '',
        };
        const interview = await interviewFormModel_1.default.create(newData);
        if (!interview) {
            return res.status(400).json({ message: "Failed to save interview form" });
        }
        const interviewId = interview._id;
        applicant.documentations.interview.push(interviewId);
        applicant.save();
        // Respond with success
        return res.status(201).json({ message: "Interview created successfully", data: interview });
    }
    catch (error) {
        logger_1.default.error(error); // Use logger in production if set up
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.createInterview = createInterview;
const updateInterview = async (req, res) => {
    try {
        const { interviewId } = req.params;
        const data = req.body;
        // Guard clause for missing interviewId
        if (!interviewId) {
            return res.status(400).json({ message: "Interview ID is required" });
        }
        // Find the interview by ID
        const interview = await interviewFormModel_1.default.findById(interviewId);
        if (!interview) {
            return res.status(404).json({ message: "Interview not found", interviewId });
        }
        // Guard clause for missing interview data
        if (!data) {
            return res.status(400).json({ message: "Interview data is required" });
        }
        // Guard clause for missing required fields
        if (data.date && !data.type && !data.recommendation) {
            return res.status(400).json({ message: "Missing required fields in interview data" });
        }
        // Guard clause for missing or invalid 'general' field
        if (data.general && (!Object.keys(data.general).length || !data.general)) {
            return res.status(400).json({ message: "General ratings are required" });
        }
        // Validate ratings in 'general' field (optional, based on your rating scale)
        if (data.general) {
            const ratingFields = ['communication', 'technical', 'problemSolving', 'culturalFit', 'workExperienceRelevance', 'leadership'];
            for (const field of ratingFields) {
                if (typeof data.general[field] !== 'number' || data.general[field] < 1 || data.general[field] > 5) {
                    return res.status(400).json({ message: `Invalid rating for ${field}. Ratings should be between 1 and 5` });
                }
            }
        }
        const userId = req.session.user?._id;
        // Update the interview record with the new data
        if (data.date)
            interview.date = data.date;
        if (data.job)
            interview.job = data.job;
        if (data.type)
            interview.type = data.type;
        if (data.recommendation)
            interview.recommendation = data.recommendation;
        if (data.general)
            interview.general = data.general;
        if (data.questions)
            interview.questions = data.questions;
        if (data.salaryExpectation)
            interview.salaryExpectation = data.salaryExpectation;
        if (data.strength)
            interview.strength = data.strength;
        if (data.weakness)
            interview.weakness = data.weakness;
        // if (data.isReviewed) interview.isReviewed.status = data.isReviewed;
        if (data.finalComments)
            interview.finalComments = data.finalComments;
        if (data.isReviewed) {
            interview.isReviewed = {
                status: data.isReviewed,
                by: new mongoose_1.default.Types.ObjectId(userId)
            };
        }
        // Save the updated interview
        await interview.save();
        // Respond with success
        return res.status(200).json({ message: "Interview updated successfully", data: interview });
    }
    catch (error) {
        logger_1.default.error(error); // Use logger in production if set up
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.updateInterview = updateInterview;
const getInterviewById = async (req, res) => {
    try {
        const { interviewId } = req.params;
        if (!interviewId) {
            return res.status(400).json({ message: "Interview Id is required" });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(interviewId)) {
            return res.status(400).json({ message: "Invalid Interview ID format" });
        }
        // Fetch the interview by its ID
        const interview = await interviewFormModel_1.default.findById(interviewId)
            .populate([
            {
                path: "applicant",
                model: "Applicant",
                select: "_id firstname lastname isShortlisted isInitialInterview isFinalInterview isJobOffer isHired"
            },
            {
                path: "interviewer",
                model: "User",
                select: "_id firstname lastname"
            },
            {
                path: "event",
                model: "FacilityEvent"
            }
        ])
            .lean();
        // If interview not found
        if (!interview) {
            return res.status(404).json({ message: "Interview not found", interviewId });
        }
        return res.status(200).json({
            data: interview,
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.getInterviewById = getInterviewById;
const getAllInterview = async (req, res) => {
    try {
        const { applicantId } = req.params;
        const searchQuery = req.query.query;
        const page = typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
        const limit = typeof req.query.limit === "string" ? parseInt(req.query.limit) : 10;
        const skip = (page - 1) * limit;
        const sortOrder = req.query.sort === "desc" ? -1 : 1;
        if (!mongoose_1.default.Types.ObjectId.isValid(applicantId)) {
            return res.status(400).json({ message: "Invalid Applicant ID format" });
        }
        // First verify the applicant exists
        const applicantExists = await applicantModel_1.default.exists({ _id: applicantId });
        if (!applicantExists) {
            return res.status(404).json({ message: "Applicant not found", applicantId });
        }
        // Initialize with required applicant filter
        const searchFilter = {
            applicant: new mongoose_1.default.Types.ObjectId(applicantId)
        };
        // Add search conditions if query exists
        if (searchQuery) {
            searchFilter.$or = [
                { recommendation: { $regex: searchQuery, $options: "i" } },
                { strength: { $regex: searchQuery, $options: "i" } },
                { weakness: { $regex: searchQuery, $options: "i" } },
                { finalComments: { $regex: searchQuery, $options: "i" } },
            ];
        }
        // Get the interviews with pagination
        const [interviews, totalItems] = await Promise.all([
            interviewFormModel_1.default.find(searchFilter)
                .populate([
                {
                    path: "applicant",
                    model: "Applicant",
                    select: "_id firstname lastname isShortlisted isInitialInterview isFinalInterview isJobOffer isHired"
                },
                {
                    path: "interviewer",
                    model: "User",
                    select: "_id firstname lastname"
                },
                {
                    path: "event",
                    model: "FacilityEvent"
                }
            ])
                .sort({ createdAt: sortOrder })
                .skip(skip)
                .limit(limit)
                .lean(),
            interviewFormModel_1.default.countDocuments(searchFilter)
        ]);
        const totalPages = Math.ceil(totalItems / limit);
        return res.status(200).json({
            data: interviews,
            totalItems,
            totalPages,
            currentPage: page,
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.getAllInterview = getAllInterview;
const getAllRecentInterviews = async (req, res) => {
    try {
        const searchQuery = req.query.query;
        const status = req.query.status; // Status filter
        const page = typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
        const limit = typeof req.query.limit === "string" ? parseInt(req.query.limit) : 10;
        const skip = (page - 1) * limit;
        // Initialize the search filter
        const searchFilter = {};
        // Add status filter if provided
        if (status) {
            searchFilter.recommendation = status; // Filter by recommendation status
        }
        // Add search conditions if a query exists
        if (searchQuery) {
            searchFilter.$or = [
                { recommendation: { $regex: searchQuery, $options: "i" } },
                { strength: { $regex: searchQuery, $options: "i" } },
                { weakness: { $regex: searchQuery, $options: "i" } },
                { finalComments: { $regex: searchQuery, $options: "i" } },
            ];
        }
        // Get the most recent interviews with pagination
        const [interviews, totalItems] = await Promise.all([
            interviewFormModel_1.default.find(searchFilter)
                .populate([
                {
                    path: "applicant",
                    model: "Applicant",
                    select: "_id firstname lastname isShortlisted isInitialInterview isisFinalInterview isJobOffer isHired"
                },
                {
                    path: "interviewer",
                    model: "User",
                    select: "_id firstname lastname"
                },
                {
                    path: "event",
                    model: "FacilityEvent"
                }
            ])
                .sort({ date: -1 }) // Sort by most recent interview date
                .skip(skip)
                .limit(limit)
                .lean(),
            interviewFormModel_1.default.countDocuments(searchFilter)
        ]);
        const totalPages = Math.ceil(totalItems / limit);
        return res.status(200).json({
            data: interviews,
            totalItems,
            totalPages,
            currentPage: page,
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.getAllRecentInterviews = getAllRecentInterviews;
