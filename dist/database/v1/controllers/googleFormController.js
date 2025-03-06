"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formSubmit = void 0;
const applicant_1 = __importDefault(require("../models/applicant"));
const config_1 = require("../../../config");
const logger_1 = __importDefault(require("../../../middlewares/logger"));
const formSubmit = async (req, res) => {
    try {
        const { secret, firstname, lastname, middlename, suffix, email, phone, address, preferredWorkLocation, linkedInProfile, portfolioLink, resumeFileLoc, yearsOfExperience, currentMostRecentJob, highestQualification, majorFieldOfStudy, institution, graduationYear, keySkills, softwareProficiency, certifications, salaryExpectation, jobAppliedFor, availability, whyAreYouInterestedInRole, } = req.body;
        const SECRET = config_1.config.google.formsKey;
        if (secret !== SECRET) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const newApplicant = await applicant_1.default.create({
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
            resumeFileLoc,
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
        res.status(201).json({ statusCode: 201, success: true, message: "Application submitted successfully", data: newApplicant });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.formSubmit = formSubmit;
