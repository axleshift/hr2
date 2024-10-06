import mongoose from "mongoose";
import Jobposting from "../models/jobpostingModel";
import Jobposter from "../models/jobposterModel";
import logger from "../../middlewares/logger";
import { Request as req, Response as res } from "express";

/**
 * Creates a new job posting in the database.
 *
 * @param req - The HTTP request object containing the job posting data.
 * @param res - The HTTP response object to send the result.
 * @param next - The next middleware function in the request-response cycle.
 * @returns A JSON response with the created job posting.
 */

export const createJobposting = async (req: req, res: res) => {
    const {
        title,
        type,
        // company,
        salary_min,
        salary_max,
        location,
        description,
        requirements,
        responsibilities,
        benefits,
        status,
        schedule_start,
        schedule_end,
    } = req.body;

    try {
        const jobposting = await Jobposting.create({
            title,
            type,
            // company,
            salary_min,
            salary_max,
            location,
            description,
            requirements,
            responsibilities,
            benefits,
            status,
            schedule_start,
            schedule_end,
            isExpired: false,
        });
        res.status(201).json({
            statusCode: 201,
            success: true,
            message: "Jobposting created successfully",
            jobposting,
        });
    } catch (error) {
        logger.error("Error creating jobposting:", error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error creating jobposting",
            error,
        });
    }
};

/**
 * Searches for job postings in the database based on the search query.
 *
 * @param req - The HTTP request object containing the search query.
 * @param res - The HTTP response object to send the result.
 * @param next - The next middleware function in the request-response cycle.
 * @returns A JSON response containing the search results.
 */
export const searchJobpostings = async (req: req, res: res) => {
    const searchQuery = req.query.query;
    const page = typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
    const limit = typeof req.query.limit === "string" ? parseInt(req.query.limit) : 9;
    const skip = (page - 1) * limit;

    try {
        const totalJobpostings = await Jobposting.countDocuments({
            $or: [{ title: { $regex: searchQuery, $options: "i" } }, { type: { $regex: searchQuery, $options: "i" } }, { company: { $regex: searchQuery, $options: "i" } }, { location: { $regex: searchQuery, $options: "i" } }],
        });

        const data = await Jobposting.find({
            $or: [{ title: { $regex: searchQuery, $options: "i" } }, { type: { $regex: searchQuery, $options: "i" } }, { company: { $regex: searchQuery, $options: "i" } }, { location: { $regex: searchQuery, $options: "i" } }],
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Jobpostings retrieved successfully",
            data,
            total: totalJobpostings,
            totalPages: Math.ceil(totalJobpostings / limit),
            currentPage: page,
        });
    } catch (error) {
        logger.error("Error retrieving jobpostings:", error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error retrieving jobpostings",
            error,
        });
    }
};

/**
 * Retrieves all job postings from the database.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @param next - The next middleware function in the request-response cycle.
 * @returns A JSON response containing all the job postings.
 */
export const getAllJobpostings = async (req: req, res: res) => {
    try {
        const page = typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
        const limit = typeof req.query.limit === "string" ? parseInt(req.query.limit) : 9;
        const skip = (page - 1) * limit;
        const totalJobpostings = await Jobposting.countDocuments();
        const jobpostings = await Jobposting.find().skip(skip).limit(limit);

        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Job postings retrieved successfully",
            data: jobpostings,
            total: totalJobpostings,
            totalPages: Math.ceil(totalJobpostings / limit),
            currentPage: page,
        });
    } catch (error) {
        logger.error("Error retrieving job postings:", error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error retrieving job postings",
            error,
        });
    }
};

/**
 * Retrieves all upcoming job postings from the database.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @param next - The next middleware function in the request-response cycle.
 * @returns A JSON response containing all the upcoming job postings.
 */
export const getAllUpcomingJobpostings = async (req: req, res: res) => {
    try {
        const page = typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
        const limit = typeof req.query.limit === "string" ? parseInt(req.query.limit) : 9;
        const skip = (page - 1) * limit;
        const totalJobpostings = await Jobposting.countDocuments();
        const jobpostings = await Jobposting.find({
            schedule_start: { $gte: new Date() },
        })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Upcoming Job postings retrieved successfully",
            data: jobpostings,
            total: totalJobpostings,
            totalPages: Math.ceil(totalJobpostings / limit),
            currentPage: page,
        });
    } catch (error) {
        logger.error("Error retrieving job postings:", error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error retrieving job postings",
            error,
        });
    }
};

/**
 * Retrieves job postings from the database with sorting and filtering based on status.
 *
 * @param req - The HTTP request object containing query parameters:
 *              - start: The start date for filtering job postings.
 *              - end: The end date for filtering job postings.
 *              - page: The current page for pagination (defaults to 1).
 *              - limit: The maximum number of results per page (defaults to 9).
 *              - sort: Sorting order, either 'asc' or 'desc' (defaults to 'asc').
 *              - filter: Job status filter, either 'all', 'active', or 'inactive' (defaults to 'all').
 * @param res - The HTTP response object to send the result.
 * @param next - The next middleware function in the request-response cycle.
 * @returns A JSON response containing the filtered, sorted, and paginated job postings.
 */

export const getAllScheduledJobpostings = async (req: req, res: res) => {
    try {
        // Extracting query parameters
        // I prolly should do more commenting so I don't forget what I did lol
        // also, for whoever is reading this, I'm sorry for the mess
        const searchQuery = req.query.query;
        const startDate = req.query.start || new Date();
        const endDate = req.query.end || new Date();
        const page = typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
        const limit = typeof req.query.limit === "string" ? parseInt(req.query.limit) : 9;
        const skip = (page - 1) * limit;

        // Sorting order: 1 for 'asc', -1 for 'desc'
        const sortOrder = req.query.sort === "desc" ? -1 : 1;
        // Filter by job status (default: 'all') with Enim: ['active', 'inactive', 'all']
        const filter = req.query.filter || "all";

        // Build the filter query based on statuss
        let statusFilter = {};
        if (filter !== "all") {
            statusFilter = { status: filter };
        }
        // if search query is provided, filter by search query
        let searchFilter = {};
        if (searchQuery) {
            searchFilter = {
                $or: [{ title: { $regex: searchQuery, $options: "i" } }],
            };
        }

        const totalJobPostings = await Jobposting.countDocuments({
            ...statusFilter,
            ...searchFilter,
            schedule_start: { $gte: startDate },
            schedule_end: { $lte: endDate },
        });

        const data = await Jobposting.find({
            ...statusFilter,
            ...searchFilter,
            schedule_start: { $gte: startDate },
            schedule_end: { $lte: endDate },
        })
            .sort({ schedule_start: sortOrder })
            .skip(skip)
            .limit(limit);

        // Sending the response
        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Job postings retrieved successfully",
            startDate,
            endDate,
            data,
            total: totalJobPostings,
            totalPages: Math.ceil(totalJobPostings / limit),
            currentPage: page,
        });
    } catch (error) {
        logger.error("Error retrieving job postings:", error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error retrieving job postings",
        });
    }
};

/**
 * Retrieves a job posting from the database by its unique identifier.
 *
 * @param req - The HTTP request object, which should contain the `id` parameter in the URL path.
 * @param res - The HTTP response object, which will be used to send the retrieved job posting.
 * @param next - The next middleware function in the request-response cycle.
 * @returns A JSON response containing the retrieved job posting.
 */
export const getJobpostingById = async (req: req, res: res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            statusCode: 400,
            success: false,
            message: "Invalid jobposting id",
        });
    }

    try {
        const jobposting = await Jobposting.findById(id);
        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Jobposting retrieved successfully",
            data: jobposting,
        });
    } catch (error) {
        logger.error("Error retrieving jobposting:", error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error retrieving jobposting",
            error,
        });
    }
};

/**
 * Updates a job posting in the database.
 *
 * @param req - The HTTP request object, which should contain the `id` parameter in the URL path and the updated job posting data in the request body.
 * @param res - The HTTP response object, which will be used to send the updated job posting.
 * @param next - The next middleware function in the request-response cycle.
 * @returns A JSON response containing the updated job posting.
 */
export const updateJobposting = async (req: req, res: res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            statusCode: 400,
            success: false,
            message: "Invalid jobposting id",
        });
    }
    const {
        title,
        type,
        // company,
        salary_min,
        salary_max,
        location,
        description,
        requirements,
        responsibilities,
        benefits,
        status,
        schedule_start,
        schedule_end,
    } = req.body;
    try {
        const jobposting = await Jobposting.findByIdAndUpdate(
            id,
            {
                title,
                type,
                // company,
                salary_min,
                salary_max,
                location,
                description,
                requirements,
                responsibilities,
                benefits,
                status,
                schedule_start,
                schedule_end,
            },
            { new: true }
        );

        const jobposter = await Jobposter.findOne({ ref_id: id });
        if (jobposter) {
            await Jobposter.updateMany({ ref_id: id }, { expiresAt: schedule_end });
        }

        res.status(201).json({
            statusCode: 201,
            success: true,
            message: "Jobposting updated successfully",
            jobposting: jobposting,
        });
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error updating jobposting",
            error,
        });
    }
};

/**
 * Deletes a job posting from the database.
 *
 * @param req - The HTTP request object, which should contain the `id` parameter in the URL path.
 * @param res - The HTTP response object, which will be used to send the result.
 * @param next - The next middleware function in the request-response cycle.
 * @returns A JSON response indicating whether the job posting was deleted successfully.
 */
export const deleteJobposting = async (req: req, res: res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            statusCode: 400,
            success: false,
            message: "Invalid jobposting id",
        });
    }

    try {
        const jobposting = await Jobposting.findByIdAndDelete(id);
        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Jobposting deleted successfully",
            jobposting: jobposting,
        });
    } catch (error) {
        logger.error("Error deleting jobposting:", error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error deleting jobposting",
            error,
        });
    }
};
