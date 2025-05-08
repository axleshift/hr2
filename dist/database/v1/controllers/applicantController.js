"use strict";
/**
 * @file applicantController.ts
 * @description Controller for handling applicant data
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = exports.getFile = exports.deleteApplicant = exports.getEligibleForJobOffer = exports.getApplicantById = exports.getApplicantByDocumentCategory = exports.searchApplicant = exports.getAllApplicant = exports.rejectApplicant = exports.updateStat = exports.updateApplicant = exports.addApplicant = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const logger_1 = __importDefault(require("../../../middlewares/logger"));
const applicantModel_1 = __importDefault(require("../models/applicantModel"));
const config_1 = require("../../../config");
const mailHandler_1 = require("../../../utils/mailHandler");
const addApplicant = async (req, res) => {
    try {
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
            message: "Applicant created successfully",
            data: newApplicant,
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({
            message: "An error occurred",
            error,
        });
    }
};
exports.addApplicant = addApplicant;
const updateApplicant = async (req, res) => {
    try {
        const applicant = await applicantModel_1.default.findById(req.params.id);
        if (!applicant) {
            return res.status(404).json({ message: "Applicant not found" });
        }
        // Handle tags, if provided
        if (req.body.tags && typeof req.body.tags === "string") {
            req.body.tags = req.body.tags.split(",").map((tag) => tag.trim());
        }
        const files = req.files;
        // If no files are uploaded, respond with an error
        // if (!files) {
        //   return res.status(400).json({ message: "No files uploaded" });
        // }
        // Build file name map
        const fileNames = {
            resume: files?.resume?.[0]?.filename,
            medCert: files?.medCert?.[0]?.filename,
            birthCert: files?.birthCert?.[0]?.filename,
            NBIClearance: files?.NBIClearance?.[0]?.filename,
            policeClearance: files?.policeClearance?.[0]?.filename,
            TOR: files?.TOR?.[0]?.filename,
            idPhoto: files?.idPhoto?.[0]?.filename,
        };
        // Merge new files with existing files (overwrite only if new files uploaded)
        const mergedFiles = {
            ...applicant.files,
            ...Object.fromEntries(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            Object.entries(fileNames).filter(([_, val]) => val !== undefined)),
        };
        // Prepare data for update
        const updateData = {
            ...req.body,
            files: mergedFiles,
        };
        // Perform update operation
        const updatedApplicant = await applicantModel_1.default.findByIdAndUpdate(req.params.id, updateData, { new: true });
        return res.status(200).json({
            message: "Applicant updated successfully",
            data: updatedApplicant,
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: "An error occurred", error });
    }
};
exports.updateApplicant = updateApplicant;
const updateStat = async (req, res) => {
    try {
        const { applicantId, stat } = req.params;
        if (!applicantId || !stat) {
            return res.status(400).json({
                message: "Applicant ID and status field are required.",
            });
        }
        const applicant = await applicantModel_1.default.findById(applicantId);
        if (!applicant) {
            return res.status(404).json({
                message: "Applicant not found.",
            });
        }
        // List of valid journey status fields
        const validJourneyStatuses = [
            "isShortlisted",
            "isInitialInterview",
            "isTechnicalInterview",
            "isPanelInterview",
            "isBehavioralInterview",
            "isFinalInterview",
            "isJobOffer",
            "isHired",
        ];
        if (!validJourneyStatuses.includes(stat)) {
            return res.status(400).json({
                message: `Invalid status field '${stat}'.`,
            });
        }
        const statusKey = stat;
        const currentStatus = applicant.statuses.journey[statusKey];
        if (typeof currentStatus !== "boolean") {
            return res.status(400).json({
                message: `Status field '${stat}' is not a boolean.`,
            });
        }
        applicant.statuses.journey[statusKey] = !currentStatus;
        await applicant.save();
        return res.status(200).json({
            message: `Applicant status '${stat}' updated successfully.`,
            data: applicant,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "An error occurred while updating status.",
            error,
        });
    }
};
exports.updateStat = updateStat;
const rejectApplicant = async (req, res) => {
    try {
        const applicantId = req.params.id;
        const applicant = await applicantModel_1.default.findById(applicantId);
        if (!applicant) {
            return res.status(404).json({
                message: "Applicant not found",
            });
        }
        const isCurrentlyRejected = applicant.status.toLowerCase() === 'Rejected';
        const newStatus = isCurrentlyRejected ? 'Active' : 'Rejected';
        applicant.status = newStatus;
        await applicant.save();
        if (newStatus === 'Rejected') {
            const fullName = `${applicant.firstname} ${applicant.lastname}`;
            const templatePath = path_1.default.join(__dirname, '../../../public/templates/rejectionEmail.html');
            const emailTemplate = await promises_1.default.readFile(templatePath, 'utf-8');
            const emailText = emailTemplate
                .replace(/{{fullName}}/g, fullName)
                .replace(/{{jobTitle}}/g, applicant.jobAppliedFor);
            const emailResult = await (0, mailHandler_1.sendEmail)('Application Update', applicant.email, 'Your Application with AxleShift', '', emailText);
            if (!emailResult.success) {
                return res.status(500).json({
                    message: `Applicant rejected, but email failed to send to ${applicant.email}`,
                    error: emailResult.message,
                    data: applicant
                });
            }
            return res.status(200).json({
                message: "Applicant rejected and email sent successfully",
                data: applicant,
            });
        }
        else {
            return res.status(200).json({
                message: "Applicant status reverted to Active",
                data: applicant,
            });
        }
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({
            message: "An error occurred",
            error,
        });
    }
};
exports.rejectApplicant = rejectApplicant;
const getAllApplicant = async (req, res) => {
    try {
        const page = typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
        const limit = typeof req.query.limit === "string" ? parseInt(req.query.limit) : 9;
        const skip = (page - 1) * limit;
        const showRejected = req.query.showRejected === "true";
        const filter = showRejected
            ? { status: { $in: ["Active", "Rejected"] } }
            : { status: "Active" };
        const applicants = await applicantModel_1.default.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        const totalItems = await applicantModel_1.default.countDocuments(filter);
        const totalPages = Math.ceil(totalItems / limit);
        return res.status(200).json({
            message: "Applicants found",
            data: applicants,
            totalItems,
            totalPages,
            currentPage: page,
            showRejected,
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({
            message: "An error occurred",
            error,
        });
    }
};
exports.getAllApplicant = getAllApplicant;
const searchApplicant = async (req, res) => {
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
                message: "No applicants found",
            });
        }
        return res.status(200).json({
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
            message: "An error occurred",
            error,
        });
    }
};
exports.searchApplicant = searchApplicant;
const getApplicantByDocumentCategory = async (req, res) => {
    try {
        const page = typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
        const limit = typeof req.query.limit === "string" ? parseInt(req.query.limit) : 9;
        const category = req.params.category;
        const skip = (page - 1) * limit;
        if (!category) {
            return res.status(400).json({ message: "Category is required" });
        }
        // Define the filter mapping for categories
        const categoryFilters = {
            screening: { "statuses.journey.screening": true },
            shortlisted: { "statuses.journey.isShortlisted": true },
            interview: { "statuses.journey.completed": true },
            training: { "documentations.training.completed": true },
            others: { "documentations.others.completed": true },
        };
        // Check if the category is valid
        const filter = categoryFilters[category];
        if (!filter) {
            return res.status(400).json({ message: "Invalid document category" });
        }
        // Get applicants using the matching filter
        const applicants = await applicantModel_1.default.find(filter).skip(skip).limit(limit);
        if (!applicants || applicants.length === 0) {
            return res.status(404).json({ message: "No applicants found" });
        }
        // Count only documents matching the category filter
        const totalItems = await applicantModel_1.default.countDocuments(filter);
        return res.status(200).json({
            message: "Applicants found",
            data: applicants,
            totalItems,
            totalPages: Math.ceil(totalItems / limit),
            currentPage: page,
        });
    }
    catch (error) {
        logger_1.default.error(error);
        return res.status(500).json({
            message: "An error occurred",
            error,
        });
    }
};
exports.getApplicantByDocumentCategory = getApplicantByDocumentCategory;
const getApplicantById = async (req, res) => {
    try {
        const applicant = await applicantModel_1.default.findById(req.params.id);
        if (!applicant) {
            return res.status(404).json({
                message: "Applicant not found",
            });
        }
        return res.status(200).json({
            message: "Applicant found",
            data: applicant,
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({
            message: "An error occurred",
            error,
        });
    }
};
exports.getApplicantById = getApplicantById;
const getEligibleForJobOffer = async (req, res) => {
    try {
        const page = typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
        const limit = typeof req.query.limit === "string" ? parseInt(req.query.limit) : 10;
        const skip = (page - 1) * limit;
        const filter = {
            "statuses.journey.isFinalInterview": true,
            "statuses.journey.isJobOffer": false,
        };
        const applicants = await applicantModel_1.default.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ updatedAt: -1 });
        const totalItems = await applicantModel_1.default.countDocuments(filter);
        return res.status(200).json({
            message: "Eligible applicants found",
            data: applicants,
            totalItems,
            totalPages: Math.ceil(totalItems / limit),
            currentPage: page,
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({
            message: "An error occurred",
            error,
        });
    }
};
exports.getEligibleForJobOffer = getEligibleForJobOffer;
const deleteApplicant = async (req, res) => {
    try {
        const applicant = await applicantModel_1.default.findById(req.params.id);
        if (!applicant) {
            return res.status(404).json({ message: "Applicant not found" });
        }
        // Delete all files in the applicant.files object
        if (applicant.files) {
            for (const [key, filePathValue] of Object.entries(applicant.files)) {
                if (filePathValue) {
                    const filePath = path_1.default.join(config_1.config.fileServer.dir, filePathValue);
                    try {
                        await promises_1.default.access(filePath);
                        await promises_1.default.unlink(filePath);
                        logger_1.default.info(`Deleted file: ${filePath}`);
                    }
                    catch (err) {
                        logger_1.default.warn(`Failed to delete ${key}: ${err}`);
                    }
                }
            }
        }
        // Overwrite PII fields with dummy or null values
        applicant.firstname = "Deleted";
        applicant.lastname = "User";
        applicant.middlename = undefined;
        applicant.suffix = undefined;
        applicant.email = "deleted@example.com";
        applicant.phone = undefined;
        applicant.address = undefined;
        applicant.linkedInProfile = undefined;
        applicant.portfolioLink = undefined;
        applicant.coverLetter = undefined;
        applicant.whyInterestedInRole = undefined;
        applicant.ids = {};
        applicant.files = {};
        // Save the obfuscated reccord
        await applicant.save();
        return res.status(200).json({
            message: "Applicant data anonymized successfully",
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({
            message: "An error occurred",
            error,
        });
    }
};
exports.deleteApplicant = deleteApplicant;
const validFileFields = [
    'resume', 'medCert', 'birthCert',
    'NBIClearance', 'policeClearance', 'TOR', 'idPhoto',
];
const validInterviewFields = [
    'InitialInterview', 'TechnicalInterview',
    'PanelInterview', 'BehavioralInterview', 'FinalInterview',
];
const getFile = async (req, res) => {
    try {
        const { applicantId, fileType } = req.params;
        const applicant = await applicantModel_1.default.findById(applicantId);
        if (!applicant) {
            return res.status(404).json({ message: "Applicant not found" });
        }
        let fileName;
        let filePath;
        const baseDir = config_1.config.fileServer.dir;
        if (validFileFields.includes(fileType)) {
            fileName = applicant.files[fileType];
            if (!fileName)
                return res.status(404).json({ error: 'File not uploaded' });
            filePath = path_1.default.join(baseDir, 'applicants', fileType, fileName);
        }
        else if (validInterviewFields.includes(fileType)) {
            fileName = applicant.interviews[fileType];
            if (!fileName)
                return res.status(404).json({ error: 'File not uploaded' });
            filePath = path_1.default.join(baseDir, 'applicants', 'file', fileName);
        }
        else {
            return res.status(400).json({ error: 'Invalid file type' });
        }
        res.download(filePath, fileName, (err) => {
            logger_1.default.error(err);
            if (!res.headersSent) {
                res.status(500).end();
            }
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({
            message: "An error occurred",
            error,
        });
    }
};
exports.getFile = getFile;
const uploadFile = async (req, res) => {
    try {
        const { applicantId, fileType } = req.params;
        const applicant = await applicantModel_1.default.findById(applicantId);
        if (!applicant) {
            return res.status(404).json({ message: 'Applicant not found' });
        }
        const validFileFields = [
            'resume', 'medCert', 'birthCert',
            'NBIClearance', 'policeClearance', 'TOR', 'idPhoto',
        ];
        const validInterviewFields = [
            'InitialInterview', 'TechnicalInterview',
            'PanelInterview', 'BehavioralInterview', 'FinalInterview',
        ];
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        if (validFileFields.includes(fileType)) {
            applicant.files[fileType] = file.filename;
        }
        else if (validInterviewFields.includes(fileType)) {
            applicant.interviews[fileType] = file.filename;
            // Update journey status
            const interviewStatusMap = {
                InitialInterview: 'isInitialInterview',
                TechnicalInterview: 'isTechnicalInterview',
                PanelInterview: 'isPanelInterview',
                BehavioralInterview: 'isBehavioralInterview',
                FinalInterview: 'isFinalInterview',
            };
            const journeyKey = interviewStatusMap[fileType];
            if (journeyKey) {
                applicant.statuses.journey[journeyKey] = true;
            }
        }
        else {
            return res.status(400).json({ message: 'Invalid file type' });
        }
        await applicant.save();
        res.status(200).json({
            message: 'File uploaded successfully',
            fileName: file.filename,
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: 'An error occurred', error });
    }
};
exports.uploadFile = uploadFile;
