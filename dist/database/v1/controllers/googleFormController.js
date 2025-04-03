"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formSubmit = void 0;
const applicantModel_1 = __importDefault(require("../models/applicantModel"));
const config_1 = require("../../../config");
const logger_1 = __importDefault(require("../../../middlewares/logger"));
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const mailHandler_1 = require("../../../utils/mailHandler");
const formSubmit = async (req, res) => {
    try {
        const { secret, firstname, lastname, middlename, suffix, email, phone, address, preferredWorkLocation, linkedInProfile, portfolioLink, resumeFileLoc, yearsOfExperience, currentMostRecentJob, highestQualification, majorFieldOfStudy, institution, graduationYear, keySkills, softwareProficiency, certifications, salaryExpectation, jobAppliedFor, availability, whyAreYouInterestedInRole, } = req.body;
        const SECRET = config_1.config.google.key;
        if (secret !== SECRET) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const newApplicant = await applicantModel_1.default.create({
            firstname,
            lastname,
            middlename,
            suffix,
            email,
            phone,
            address,
            preferredWorkLocation,
            linkedInProfile,
            portfolioLink,
            resumeFileLoc: resumeFileLoc[0],
            yearsOfExperience,
            currentMostRecentJob,
            highestQualification,
            majorFieldOfStudy,
            institution,
            graduationYear,
            keySkills,
            softwareProficiency,
            certifications,
            salaryExpectation,
            jobAppliedFor,
            availability,
            whyAreYouInterestedInRole,
        });
        if (!newApplicant) {
            return res.status(400).json({ message: "Failed to submit application" });
        }
        const fullName = `${firstname} ${lastname}`;
        const applicationDate = new Date().toLocaleDateString();
        const referenceNumber = newApplicant._id;
        // Fixing typo in template file name
        const templatePath = path_1.default.join(__dirname, "../../../public/template/applicationReceived.html");
        // Ensure the template file exists before reading
        try {
            await promises_1.default.access(templatePath);
        }
        catch (err) {
            logger_1.default.error("Email template file not found:", err);
            return res.status(500).json({ message: "Email template missing" });
        }
        let emailTemplate = await promises_1.default.readFile(templatePath, "utf-8");
        // Replacing placeholders in the email template
        emailTemplate = emailTemplate
            .replace(/{{fullName}}/g, fullName)
            .replace(/{{applicationDate}}/g, applicationDate)
            .replace(/{{referenceNumber}}/g, referenceNumber)
            .replace(/{{jobTitle}}/g, jobAppliedFor)
            .replace(/{{responseTimeframe}}/g, "two weeks");
        // Sending email notification
        const emailResult = await (0, mailHandler_1.sendEmail)("Application Received", email, "Your Job Application at Our Company", emailTemplate);
        if (emailResult) {
            logger_1.default.info(`Email notification sent to ${fullName} (${email})`);
        }
        else {
            logger_1.default.warn(`Failed to send email notification to ${fullName} (${email})`);
        }
        res.status(201).json({
            statusCode: 201,
            success: true,
            message: "Application submitted successfully. A confirmation email has been sent.",
            data: newApplicant,
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.formSubmit = formSubmit;
