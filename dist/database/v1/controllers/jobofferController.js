"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendJobOfferMail = exports.getAllRecentJoboffer = exports.getAllJoboffer = exports.getJobofferById = exports.updateJoboffer = exports.createJoboffer = void 0;
const logger_1 = __importDefault(require("../../../middlewares/logger"));
const applicantModel_1 = __importDefault(require("../models/applicantModel"));
const jobOfferFormModel_1 = __importDefault(require("../models/jobOfferFormModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const mailHandler_1 = require("../../../utils/mailHandler");
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const createJoboffer = async (req, res) => {
    try {
        const { applicantId } = req.params;
        const { position, salary, startDate, benefits, notes } = req.body;
        if (!applicantId) {
            return res.status(400).json({ message: 'Applicant Id is required.', applicantId });
        }
        if (!position || !salary || !startDate) {
            return res.status(400).json({ message: 'Missing required fields', data: req.body });
        }
        const applicant = await applicantModel_1.default.findById(applicantId);
        if (!applicant) {
            return res.status(404).json({ message: 'Applicant not found', applicantId });
        }
        const userId = req.session.user?._id;
        const data = {
            applicant: applicantId,
            position: position,
            salary: salary,
            startDate: startDate,
            benefits: benefits,
            status: 'Pending',
            issuedBy: userId,
            issuedDate: new Date(),
            notes: notes,
        };
        const joboffer = await jobOfferFormModel_1.default.create(data);
        if (!joboffer) {
            return res.status(400).json({ message: 'Failed to save job offer' });
        }
        const jobofferId = joboffer._id;
        applicant.isJobOffer = true;
        applicant.documentations.jobOffer = jobofferId;
        await applicant.save();
        // Optionally, populate applicant details if needed:
        await joboffer.populate({
            path: 'applicant',
            model: 'Applicant',
            select: "_id firstname lastname isShortlisted isInitialInterview isFinalInterview isJobOffer isHired"
        });
        res.status(201).json({
            message: 'Job offer successfully created.',
            data: joboffer
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.createJoboffer = createJoboffer;
const updateJoboffer = async (req, res) => {
    try {
        const { jobofferId } = req.params;
        const { position, salary, startDate, benefits, status, notes } = req.body;
        const { isApproved } = req.query;
        if (!jobofferId) {
            return res.status(400).json({ message: 'Job offer ID is required.', jobofferId });
        }
        if (!position || !salary || !startDate || !status) {
            return res.status(400).json({ message: 'Missing required fields', data: req.body });
        }
        const joboffer = await jobOfferFormModel_1.default.findById(jobofferId);
        if (!joboffer) {
            return res.status(404).json({ message: 'Job offer not found', jobofferId });
        }
        const userId = req.session.user?._id;
        joboffer.position = position;
        joboffer.salary = salary;
        joboffer.startDate = new Date(startDate);
        joboffer.benefits = benefits;
        joboffer.status = status;
        joboffer.notes = notes;
        if (isApproved !== undefined) {
            joboffer.approvedBy = new mongoose_1.default.Types.ObjectId(userId);
            joboffer.approvedDate = new Date();
        }
        const j = await joboffer.save();
        const updatedJoboffer = await j
            .populate({
            path: 'approvedBy',
            model: 'User',
            select: "_id firstname lastname role"
        });
        return res.status(200).json({
            message: 'Job offer successfully updated.',
            data: updatedJoboffer
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.updateJoboffer = updateJoboffer;
const getJobofferById = async (req, res) => {
    try {
        const { jobofferId } = req.params;
        if (!jobofferId) {
            return res.status(400).json({ message: "Joboffer Id is required" });
        }
        const joboffer = await jobOfferFormModel_1.default.findById(jobofferId)
            .populate([
            {
                path: "applicant",
                model: "Applicant",
                select: "_id firstname lastname isShortlisted isInitialInterview isFinalInterview isJobOffer isHired"
            },
            {
                path: "issuedBy",
                model: "User",
                select: "_id firstname lastname"
            },
            {
                path: "approvedBy",
                model: "User",
                select: "_id firstname lastname"
            },
        ])
            .lean();
        if (!joboffer) {
            return res.status(404).json({ message: 'Job offer not found', jobofferId });
        }
        return res.status(200).json({
            data: joboffer,
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.getJobofferById = getJobofferById;
const getAllJoboffer = async (req, res) => {
    try {
        const { applicantId } = req.params;
        const searchQuery = req.query.query;
        const page = typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
        const limit = typeof req.query.limit === "string" ? parseInt(req.query.limit) : 10;
        const skip = (page - 1) * limit;
        const sortOrder = req.query.sort === "desc" ? -1 : 1;
        if (!applicantId) {
            return res.status(400).json({ message: "Applicant Id is required", applicantId });
        }
        const applicant = applicantModel_1.default.findById(applicantId);
        if (!applicant) {
            return res.status(404).json({ message: 'Applicant is not found', applicantId });
        }
        const searchFilter = {
            applicant: new mongoose_1.default.Types.ObjectId(applicantId)
        };
        if (searchQuery) {
            searchFilter.$or = [
                { position: { $regex: searchQuery, $options: "i" } },
                { salary: { $regex: searchQuery, $options: "i" } },
                { benefits: { $regex: searchQuery, $options: "i" } },
                { notes: { $regex: searchQuery, $options: "i" } },
            ];
        }
        const [joboffers, totalItems] = await Promise.all([
            jobOfferFormModel_1.default.find(searchFilter)
                .populate([
                {
                    path: "applicant",
                    model: "Applicant",
                    select: "_id firstname lastname isShortlisted isInitialInterview isFinalInterview isJobOffer isHired"
                },
                {
                    path: "issuedBy",
                    model: "User",
                    select: "_id firstname lastname"
                },
                {
                    path: "approvedBy",
                    model: "User",
                    select: "_id firstname lastname"
                },
            ])
                .sort({ createdAt: sortOrder })
                .skip(skip)
                .limit(limit)
                .lean(),
            jobOfferFormModel_1.default.countDocuments(searchFilter)
        ]);
        const totalPages = Math.ceil(totalItems / limit);
        return res.status(200).json({
            data: joboffers,
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
exports.getAllJoboffer = getAllJoboffer;
const getAllRecentJoboffer = async (req, res) => {
    try {
        const { status, approvedJoboffer } = req.query;
        const page = typeof req.query.page === 'string' ? parseInt(req.query.page) : 1;
        const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit) : 10;
        const skip = (page - 1) * limit;
        const sortOrder = req.query.sort === 'desc' ? -1 : 1;
        // Create search filter with correct typing
        const searchFilter = {};
        // Apply status filter if provided
        if (status && typeof status === 'string') {
            searchFilter.status = status;
        }
        // Apply approval filter if provided
        if (approvedJoboffer) {
            searchFilter.approvedBy = { $exists: approvedJoboffer === 'true' }; // Checking if approvedBy exists
        }
        // Fetch job offers with the filters and pagination
        const [jobOffers, totalItems] = await Promise.all([
            jobOfferFormModel_1.default.find(searchFilter)
                .populate([
                { path: 'applicant', model: 'Applicant', select: '_id firstname lastname' },
                { path: 'issuedBy', model: 'User', select: '_id firstname lastname' },
                { path: 'approvedBy', model: 'User', select: '_id firstname lastname' },
            ])
                .sort({ issuedDate: sortOrder })
                .skip(skip)
                .limit(limit)
                .lean(),
            jobOfferFormModel_1.default.countDocuments(searchFilter),
        ]);
        const totalPages = Math.ceil(totalItems / limit);
        return res.status(200).json({
            data: jobOffers,
            totalItems,
            totalPages,
            currentPage: page,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.getAllRecentJoboffer = getAllRecentJoboffer;
const sendJobOfferMail = async (req, res) => {
    try {
        const { jobofferId } = req.params;
        if (!jobofferId) {
            return res.status(400).json({ message: 'Job offer Id is required', jobofferId });
        }
        const joboffer = await jobOfferFormModel_1.default.findById(jobofferId).populate({
            path: 'applicant',
            model: 'Applicant',
            select: "_id firstname lastname isShortlisted isInitialInterview isFinalInterview isJobOffer isHired"
        });
        if (!joboffer) {
            return res.status(404).json({ message: 'Job offer not found' });
        }
        const applicant = await applicantModel_1.default.findById(joboffer.applicant);
        if (!applicant) {
            return res.status(404).json({ message: 'Applicant not found' });
        }
        const templatePath = path_1.default.join(__dirname, '../../../public/templates/jobofferEmail.html');
        const emailTemplate = await promises_1.default.readFile(templatePath, 'utf-8');
        const today = new Date();
        const responseDeadline = new Date();
        responseDeadline.setDate(today.getDate() + 7);
        joboffer.emailsent = true;
        joboffer.emailSentDate = today;
        joboffer.expires = responseDeadline;
        await joboffer.save();
        const fullName = `${applicant.firstname} ${applicant.lastname}`;
        const emailText = emailTemplate
            .replace(/{{fullName}}/g, fullName)
            .replace(/{{jobTitle}}/g, joboffer.position?.toString() || 'Unknown')
            .replace(/{{salaryAmount}}/g, joboffer.salary?.toString() || '0')
            .replace(/{{currency}}/g, 'PHP')
            .replace(/{{salaryUnit}}/g, 'Month')
            .replace(/{{startDate}}/g, joboffer.startDate ? joboffer.startDate.toDateString() : 'Unknown')
            .replace(/{{responseDeadline}}/g, responseDeadline.toDateString());
        const emailResult = await (0, mailHandler_1.sendEmail)('Job Offer', applicant.email, 'Your Job Offer from AxleShift', '', emailText);
        if (emailResult.success) {
            return res.status(200).json({
                message: `Job offer email successfully sent to ${applicant.email}`,
                joboffer
            });
        }
        else {
            return res.status(500).json({
                message: `Failed to send email to ${applicant.email}`,
                error: emailResult.message,
            });
        }
    }
    catch (error) {
        logger_1.default.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.sendJobOfferMail = sendJobOfferMail;
