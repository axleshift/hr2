"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJobpostingFromJob = exports.getAllJob = exports.getJobById = exports.updateJob = exports.createJob = void 0;
const logger_1 = __importDefault(require("../../../middlewares/logger"));
const jobModel_1 = __importDefault(require("../models/jobModel"));
const jobpostingModel_1 = __importDefault(require("../models/jobpostingModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const createJob = async (req, res) => {
    try {
        const { title, responsibilities, requirements, qualifications, benefits, category, capacity } = req.body;
        if (!title || !responsibilities || !requirements || !qualifications || !benefits || !category) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const userId = req.session.user?._id;
        const jobData = {
            title,
            author: new mongoose_1.default.Types.ObjectId(userId),
            responsibilities,
            requirements,
            qualifications,
            benefits,
            category,
            capacity,
        };
        const newJob = await jobModel_1.default.create(jobData);
        if (!newJob) {
            return res.status(500).json({ message: "Job not created" });
        }
        return res.status(201).json({ message: "New job created", data: newJob });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.createJob = createJob;
const updateJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const { title, responsibilities, requirements, qualifications, benefits, category, capacity } = req.body;
        if (!jobId) {
            return res.status(400).json({ message: "Job Id is required" });
        }
        if (!title || !responsibilities || !requirements || !qualifications || !benefits || !category) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const job = await jobModel_1.default.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        job.title = title;
        job.responsibilities = responsibilities;
        job.requirements = requirements;
        job.qualifications = qualifications;
        job.benefits = benefits;
        job.category = category;
        job.capacity = capacity;
        const updatedJob = await job.save();
        if (!updatedJob) {
            return res.status(404).json({ message: "Job not updated" });
        }
        return res.status(201).json({ message: "job updated", data: updatedJob });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.updateJob = updateJob;
const getJobById = async (req, res) => {
    try {
        const { jobId } = req.params;
        if (!jobId) {
            return res.status(500).json({ message: "Job Id is required" });
        }
        const job = await jobModel_1.default.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        return res.status(200).json({ message: "Job found", data: job });
    }
    catch (error) {
        logger_1.default.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.getJobById = getJobById;
const getAllJob = async (req, res) => {
    try {
        const searchQuery = req.query.query;
        const page = typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
        const limit = typeof req.query.limit === "string" ? parseInt(req.query.limit) : 10;
        const skip = (page - 1) * limit;
        const sortOrder = req.query.sort === "desc" ? -1 : 1;
        let searchFilter = {};
        if (searchQuery) {
            searchFilter = {
                $or: [
                    { title: { $regex: searchQuery, $options: "i" } },
                    { responsibilities: { $regex: searchQuery, $options: "i" } },
                    { requirements: { $regex: searchQuery, $options: "i" } },
                    { qualifications: { $regex: searchQuery, $options: "i" } },
                    { benefits: { $regex: searchQuery, $options: "i" } },
                ],
            };
        }
        const totalItems = await jobModel_1.default.countDocuments(searchFilter);
        const totalPages = Math.ceil(totalItems / limit);
        const jobs = await jobModel_1.default.find(searchFilter).sort({ createdAt: sortOrder }).skip(skip).limit(limit);
        if (jobs.length === 0) {
            const msg = searchQuery ? `No jobs found for query: ${searchQuery}` : "No jobs found";
            return res.status(404).json({ message: msg });
        }
        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Jobs found",
            data: jobs,
            totalItems,
            totalPages,
            currentPage: page,
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: "Internal server error", error });
    }
};
exports.getAllJob = getAllJob;
const createJobpostingFromJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const { title, type, salary_min, salary_max, location, description, requirements, responsibilities, benefits, status, schedule_start, schedule_end, } = req.body;
        if (!jobId) {
            return res.status(400).json({ message: "Job Id is required" });
        }
        const job = await jobModel_1.default.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        const newJobpost = await jobpostingModel_1.default.create({
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
        job.jobpost = new mongoose_1.default.Types.ObjectId(newJobpost._id);
        const jobSave = await job.save();
        if (!newJobpost && !jobSave) {
            return res.status(500).json({ message: "Failed to create jobposting", data: req.body });
        }
        return res.status(200).json({ message: "Jobposting successfully created", data: newJobpost });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({});
    }
};
exports.createJobpostingFromJob = createJobpostingFromJob;
