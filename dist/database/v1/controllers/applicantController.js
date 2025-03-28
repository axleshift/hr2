"use strict";
/**
 * @file applicantController.ts
 * @description Controller for handling applicant data
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteResume = exports.getResumeById = exports.getApplicantByDocumentCategory = exports.searchResume = exports.getResumeFile = exports.getAllResumeData = exports.updateResume = exports.addNewResume = exports.handleFileUpload = void 0;
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
        console.log(req.body);
        // const file = (await handleFileUpload(req, res)) as Express.Multer.File;
        // if (!file) {
        //   return res.status(400).json({
        //     statusCode: 400,
        //     success: false,
        //     message: "Please upload a file",
        //   });
        // }
        // const childDir = "applicants";
        // const filePath = `/${childDir}/${file.filename}`;
        if (req.body.tags) {
            req.body.tags = req.body.tags.split(",");
        }
        const data = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            middlename: req.body.middlename,
            suffix: req.body.suffix,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
            preferredWorkLocation: req.body.preferredWorkLocation,
            linkedInProfile: req.body.linkedInProfile,
            portfolioLink: req.body.portfolioLink,
            // resumeFileLoc: filePath,
            yearsOfExperience: req.body.yearsOfExperience,
            currentMostRecentJob: req.body.currentMostRecentJob,
            highestQualification: req.body.highestQualification,
            majorFieldOfStudy: req.body.majorFieldOfStudy,
            institution: req.body.institution,
            graduationYear: req.body.graduationYear,
            keySkills: req.body.keySkills,
            softwareProficiency: req.body.softwareProficiency,
            certifications: req.body.certifications,
            coverLetter: req.body.coverLetter,
            salaryExpectation: req.body.salaryExpectation,
            availability: req.body.availability,
            jobAppliedFor: req.body.jobAppliedFor,
            whyInterestedInRole: req.body.whyInterestedInRole,
            tags: req.body.tags,
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
        const applicant = await applicantModel_1.default.findById(req.params.id);
        if (!applicant) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "Applicant not found",
            });
        }
        if (req.body.tags) {
            req.body.tags = req.body.tags.split(",");
        }
        const data = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            middlename: req.body.middlename,
            suffix: req.body.suffix,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
            preferredWorkLocation: req.body.preferredWorkLocation,
            linkedInProfile: req.body.linkedInProfile,
            portfolioLink: req.body.portfolioLink,
            // resumeFileLoc: req.body.resumeFileLoc,
            yearsOfExperience: req.body.yearsOfExperience,
            currentMostRecentJob: req.body.currentMostRecentJob,
            highestQualification: req.body.highestQualification,
            majorFieldOfStudy: req.body.majorFieldOfStudy,
            institution: req.body.institution,
            graduationYear: req.body.graduationYear,
            keySkills: req.body.keySkills,
            softwareProficiency: req.body.softwareProficiency,
            certifications: req.body.certifications,
            coverLetter: req.body.coverLetter,
            salaryExpectation: req.body.salaryExpectation,
            availability: req.body.availability,
            jobAppliedFor: req.body.jobAppliedFor,
            whyInterestedInRole: req.body.whyInterestedInRole,
            tags: req.body.tags,
        };
        const updatedApplicant = await applicantModel_1.default.findByIdAndUpdate(req.params.id, data, { new: true });
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
const getApplicantByDocumentCategory = async (req, res) => {
    try {
        const page = typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
        const limit = typeof req.query.limit === "string" ? parseInt(req.query.limit) : 9;
        const category = req.params.category;
        const skip = (page - 1) * limit;
        console.log(req.params);
        if (!category) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: "category is required",
            });
        }
        // Query applicants with the given status category completed as true
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let applicants;
        switch (category) {
            case "screening":
                applicants = await applicantModel_1.default.find({ "documentations.screening.completed": true }).skip(skip).limit(limit);
                break;
            case "shortlisted":
                applicants = await applicantModel_1.default.find({ isShortlisted: true }).skip(skip).limit(limit);
                break;
            case "interview":
                applicants = await applicantModel_1.default.find({ "documentations.interview.completed": true }).skip(skip).limit(limit);
                break;
            case "training":
                applicants = await applicantModel_1.default.find({ "documentations.training.completed": true }).skip(skip).limit(limit);
                break;
            case "others":
                applicants = await applicantModel_1.default.find({ "documentations.others.completed": true }).skip(skip).limit(limit);
                break;
            default:
                return res.status(400).json({
                    statusCode: 400,
                    success: false,
                    message: "Invalid DocCategory",
                });
        }
        if (!applicants || applicants.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "No applicants found",
            });
        }
        const totalItems = await applicantModel_1.default.countDocuments();
        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Applicants found",
            data: applicants,
            totalItems,
            totalPages: Math.ceil(totalItems / limit),
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
exports.getApplicantByDocumentCategory = getApplicantByDocumentCategory;
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
        const filePath = path_1.default.join(config_1.config.fileServer.dir, applicant.resumeFileLoc || "");
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
