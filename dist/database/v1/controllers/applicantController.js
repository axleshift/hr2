"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteResume = exports.getResumeById = exports.searchResume = exports.getResumeFile = exports.getAllResumeData = exports.updateResume = exports.addNewResume = exports.handleFileUpload = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const logger_1 = __importDefault(require("../../../middlewares/logger"));
const fileUploadHandler_1 = require("../../../utils/fileUploadHandler");
const applicantModel_1 = __importDefault(require("../models/applicantModel"));
const config_1 = require("../../../config");
const handleFileUpload = (req, res) => {
    return new Promise((resolve, reject) => {
        (0, fileUploadHandler_1.upload)("applicants").single("file")(req, res, (err) => {
            if (err) {
                reject(err);
            }
            resolve(req.file);
        });
    });
};
exports.handleFileUpload = handleFileUpload;
const addNewResume = async (req, res) => {
    try {
        const file = (await (0, exports.handleFileUpload)(req, res));
        if (!file) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: "Please upload a file",
                error: "No file uploaded",
            });
        }
        const childDir = "applicants";
        const filePath = `/${childDir}/${file.filename}`;
        const data = {
            firstname: req.body.firstname,
            middlename: req.body.middlename,
            lastname: req.body.lastname,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
            portfolioURL: req.body.portfolioURL,
            professionalSummary: req.body.professionalSummary,
            skills: req.body.skills,
            workExperience: req.body.workExperience,
            education: req.body.education,
            certifications: JSON.parse(req.body.certifications),
            tags: JSON.parse(req.body.tags),
            remarks: req.body.remarks,
            resumeFileLoc: filePath,
        };
        const newApplicant = await applicantModel_1.default.create(data);
        return res.status(201).json({
            statusCode: 201,
            success: true,
            message: "Applicant created successfully",
            data: newApplicant,
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "An error occurred",
            error,
        });
    }
};
exports.addNewResume = addNewResume;
const updateResume = async (req, res) => {
    try {
        const file = (await (0, exports.handleFileUpload)(req, res));
        const data = {};
        const fieldsToUpdate = ["firstname", "middlename", "lastname", "email", "phone", "address", "portfolioURL", "professionalSummary", "skills", "workExperience", "education", "certifications", "tags", "remarks"];
        fieldsToUpdate.forEach((field) => {
            if (req.body[field]) {
                data[field] = field === "certifications" || field === "tags" ? JSON.parse(req.body[field]) : req.body[field];
            }
        });
        if (file) {
            const applicant = (await applicantModel_1.default.findById(req.params.id).exec());
            const childDir = "applicants";
            if (!applicant) {
                return res.status(404).json({
                    statusCode: 404,
                    success: false,
                    message: "Applicant not found",
                });
            }
            const filePath = `/${childDir}/${applicant.resumeFileLoc}`;
            try {
                await promises_1.default.unlink(filePath);
            }
            catch (error) {
                logger_1.default.error("Error deleting file: ", error);
            }
            data.resumeFileLoc = `/${childDir}/${file.filename}`;
        }
        const updatedApplicant = await applicantModel_1.default.findByIdAndUpdate(req.params.id, data, {
            new: true,
        });
        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Applicant updated successfully",
            data: updatedApplicant,
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "An error occurred",
            error,
        });
    }
};
exports.updateResume = updateResume;
const getAllResumeData = async (req, res) => {
    try {
        const page = typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
        const limit = typeof req.query.limit === "string" ? parseInt(req.query.limit) : 9;
        const skip = (page - 1) * limit;
        const applicants = await applicantModel_1.default.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
        const totalItems = await applicantModel_1.default.countDocuments();
        const totalPages = Math.ceil(totalItems / limit);
        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Applicants found",
            data: applicants,
            totalItems,
            totalPages,
            currentPage: page,
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "An error occurred",
            error,
        });
    }
};
exports.getAllResumeData = getAllResumeData;
const getResumeFile = async (req, res) => {
    try {
        // Find the applicant by ID
        const applicant = await applicantModel_1.default.findById(req.params.id);
        if (!applicant) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "Applicant not found",
            });
        }
        // Construct the file path
        const filePath = `${config_1.config.fileServer.dir}/${applicant.resumeFileLoc}`;
        logger_1.default.info(`Downloading file: ${filePath}`);
        // Check if file exists before attempting to download
        res.download(filePath, (err) => {
            if (err) {
                logger_1.default.error(err);
                return res.status(500).json({
                    statusCode: 500,
                    success: false,
                    message: "Failed to download file",
                });
            }
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "An error occurred",
            error,
        });
    }
};
exports.getResumeFile = getResumeFile;
const searchResume = async (req, res) => {
    try {
        logger_1.default.info("Searching for resumes...");
        logger_1.default.info("Search Query:");
        logger_1.default.info(req.query.query);
        const searchQuery = req.query.query;
        const tags = req.query.tags ? (Array.isArray(req.query.tags) ? req.query.tags.map(String) : req.query.tags.split(",")) : [];
        const page = typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
        const limit = typeof req.query.limit === "string" ? parseInt(req.query.limit) : 9;
        const skip = (page - 1) * limit;
        let searchCriteria = {
            $or: [
                { firstname: { $regex: searchQuery, $options: "i" } },
                { lastname: { $regex: searchQuery, $options: "i" } },
                { email: { $regex: searchQuery, $options: "i" } },
                { phone: { $regex: searchQuery, $options: "i" } },
                { address: { $regex: searchQuery, $options: "i" } },
                { skills: { $regex: searchQuery, $options: "i" } },
                { workExperience: { $regex: searchQuery, $options: "i" } },
                { education: { $regex: searchQuery, $options: "i" } },
                { remarks: { $regex: searchQuery, $options: "i" } },
                {
                    certifications: {
                        $elemMatch: {
                            $regex: searchQuery,
                            $options: "i",
                        },
                    },
                },
            ],
        };
        if (tags.length > 0) {
            if (searchQuery) {
                searchCriteria = {
                    $and: [searchCriteria, { tags: { $in: tags } }],
                };
            }
            else {
                searchCriteria = { tags: { $in: tags } };
            }
        }
        const applicants = await applicantModel_1.default.find(searchCriteria).sort({ createdAt: -1 }).skip(skip).limit(limit);
        const totalItems = await applicantModel_1.default.countDocuments(searchCriteria);
        if (!applicants || applicants.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "No applicants found",
            });
        }
        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Applicants found",
            data: applicants,
            totalItems,
            totalPages: Math.ceil(totalItems / limit),
            tags: tags,
            currentPage: page,
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "An error occurred",
            error,
        });
    }
};
exports.searchResume = searchResume;
const getResumeById = async (req, res) => {
    try {
        const applicant = await applicantModel_1.default.findById(req.params.id);
        if (!applicant) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "Applicant not found",
            });
        }
        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Applicant found",
            data: applicant,
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "An error occurred",
            error,
        });
    }
};
exports.getResumeById = getResumeById;
const deleteResume = async (req, res) => {
    try {
        const applicant = await applicantModel_1.default.findById(req.params.id);
        if (!applicant) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "Applicant not found",
            });
        }
        const filePath = path_1.default.join(config_1.config.fileServer.dir, applicant.resumeFileLoc);
        try {
            await promises_1.default.access(filePath); // Check if the file exists
            await promises_1.default.unlink(filePath); // Delete the file
        }
        catch (fileError) {
            logger_1.default.error("Error deleting file: ", fileError);
            return res.status(500).json({
                statusCode: 500,
                success: false,
                message: "Error deleting the file",
                error: fileError,
            });
        }
        await applicantModel_1.default.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Applicant deleted successfully",
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "An error occurred",
            error,
        });
    }
};
exports.deleteResume = deleteResume;
