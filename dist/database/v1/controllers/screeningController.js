"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllScreening = exports.updateScreening = exports.createScreening = exports.screenApplicantViaAI = void 0;
const logger_1 = __importDefault(require("../../../middlewares/logger"));
const applicantModel_1 = __importDefault(require("../models/applicantModel"));
const screeningFormModel_1 = __importDefault(require("../models/screeningFormModel"));
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const config_1 = require("../../../config");
const mongoose_1 = __importDefault(require("mongoose"));
const jobModel_1 = __importDefault(require("../models/jobModel"));
const responseParser = (aiResponse) => {
    // God why is regex so hard
    const summaryRegex = /## Summary:\s*([\s\S]*?)\s*(?=## Score Breakdown)/;
    const scoreRegex = /## Score Breakdown:\s*- Experience: (\d+)\s*- Education: (\d+)\s*- Skills: (\d+)\s*- Motivation: (\d+)/;
    const commentsRegex = /## Comments:\s*([\s\S]*)/;
    const recommendationRegex = /## Recommendation:\s*([\s\S]*)/;
    // Log the raw response to check its structure, please do not touch this, self. This is important.
    console.info("Raw AI response:\n", aiResponse);
    // Extract the sections using regular expressions cuz h
    const summaryMatch = aiResponse.match(summaryRegex);
    const scoreMatch = aiResponse.match(scoreRegex);
    const commentsMatch = aiResponse.match(commentsRegex);
    const recommendationMatch = aiResponse.match(recommendationRegex);
    // Throw error if any section is not found or is empty
    if (!summaryMatch || !scoreMatch || !commentsMatch || !recommendationMatch ||
        summaryMatch[1].trim() === '' || commentsMatch[1].trim() === '' || recommendationMatch[1].trim() === '') {
        throw new Error("Failed to parse AI response");
    }
    let recommendation = recommendationMatch[1].trim().toLowerCase();
    recommendation = recommendation.split('\n')[0].trim();
    if (!['yes', 'no', 'needs further review'].includes(recommendation)) {
        recommendation = 'needs further review';
    }
    // Function to clean text fields by removing symbolic terms and other artifacts
    const cleanedText = (text) => {
        return text
            // eslint-disable-next-line no-useless-escape
            .replace(/[^a-zA-Z0-9\s.,!?;:'"(){}\[\]$€¥£%+=*/<>#&_…—-]/g, '') // Allows structured characters
            .replace(/\s{2,}/g, ' ') // Collapses multiple spaces
            .trim(); // Removes extra whitespace
    };
    // Create the parsed response object with cleaned text fields
    const parsedResponse = {
        summary: cleanedText(summaryMatch[1]),
        scoreBreakdown: {
            experience: parseInt(scoreMatch[1], 10),
            education: parseInt(scoreMatch[2], 10),
            skills: parseInt(scoreMatch[3], 10),
            motivation: parseInt(scoreMatch[4], 10),
        },
        comments: cleanedText(commentsMatch[1]),
        recommendation: recommendation,
    };
    return parsedResponse;
};
const jobParser = (job) => `
  Title: ${job.title}
  
  Responsibilities:
  ${job.responsibilities}
  
  Requirements:
  ${job.requirements}
  
  Qualifications:
  ${job.qualifications}
  
  Benefits:
  ${job.benefits}
  
  Category: ${job.category}
`;
const screenApplicantViaAI = async (req, res) => {
    try {
        const { applicantId, jobId, screenId } = req.params;
        const { customPrompt } = req.body;
        if (!applicantId) {
            return res.status(400).json({ message: "Applicant Id is required", applicantId });
        }
        if (!jobId) {
            return res.status(400).json({ message: "Job Id is required", jobId });
        }
        const applicant = await applicantModel_1.default.findById(applicantId);
        if (!applicant) {
            return res.status(404).json({ message: "No applicant found", applicantId });
        }
        const job = await jobModel_1.default.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found", jobId });
        }
        const defaultTaskPath = path_1.default.join(__dirname, '../../../public/prompts/screeningTask.txt');
        const taskTemplate = await promises_1.default.readFile(defaultTaskPath, "utf-8");
        const promptPath = path_1.default.join(__dirname, '../../../public/prompts/screening.txt');
        const promptTemplate = await promises_1.default.readFile(promptPath, "utf-8");
        const jobDescription = jobParser(job);
        const prompText = promptTemplate
            .replace(/{{ task }}/g, customPrompt || taskTemplate)
            .replace(/{{ jobDescription }}/g, jobDescription || '')
            .replace(/{{ yearsOfExperience }}/g, applicant.yearsOfExperience.toString())
            .replace(/{{ currentMostRecentJob }}/g, applicant.currentMostRecentJob || "")
            .replace(/{{ highestQualification }}/g, applicant.highestQualification || "")
            .replace(/{{ majorFieldOfStudy }}/g, applicant.majorFieldOfStudy || "")
            .replace(/{{ institution }}/g, applicant.institution || "")
            .replace(/{{ keySkills }}/g, applicant.keySkills || "")
            .replace(/{{ softwareProficiency }}/g, applicant.softwareProficiency || "")
            .replace(/{{ certifications }}/g, applicant.certifications || "")
            .replace(/{{ salaryExpectation }}/g, applicant.salaryExpectation?.toString() || "")
            .replace(/{{ availability }}/g, applicant.availability || "")
            .replace(/{{ jobAppliedFor }}/g, applicant.jobAppliedFor || "")
            .replace(/{{ whyInterestedInRole }}/g, applicant.whyInterestedInRole || "");
        const key = config_1.config.anthropic.key;
        if (!key) {
            return res.status(400).json({ message: "Antropic Key is empty", key });
        }
        const ant = new sdk_1.default({
            apiKey: key
        });
        const antResponse = await ant.messages.create({
            model: 'claude-3-7-sonnet-20250219',
            max_tokens: 2000,
            messages: [
                { role: 'user', content: prompText }
            ]
        });
        const formatResponse = antResponse.content
            .filter(block => 'text' in block)
            .map(block => block.text)
            .join(""); // Ensure newlines are properly preserved
        const parsed = responseParser(formatResponse);
        if (!parsed) {
            return res.status(404).json({ message: "Failed to create AI response, either try again or contact admin." });
        }
        console.info("Parsed Response", parsed);
        const user = req.session.user;
        if (!user) {
            return res.status(404).json({ message: "User session not found, please log in again." });
        }
        const screeningData = {
            applicant: new mongoose_1.default.Types.ObjectId(applicantId),
            reviewer: new mongoose_1.default.Types.ObjectId(user._id),
            recommendation: parsed.recommendation.toLowerCase().toString(),
            job: new mongoose_1.default.Types.ObjectId(jobId),
            aiAnalysis: {
                summary: parsed.summary,
                scoreBreakdown: {
                    experience: parsed.scoreBreakdown.experience,
                    education: parsed.scoreBreakdown.education,
                    skills: parsed.scoreBreakdown.skills,
                    motivation: parsed.scoreBreakdown.motivation
                },
                comments: parsed.comments,
            }
        };
        let screening;
        if (screenId) {
            // If screenId is provided, update the existing screening
            screening = await screeningFormModel_1.default.findByIdAndUpdate(screenId, screeningData, { new: true }).populate({
                path: 'job',
                model: 'Job'
            });
            if (!screening) {
                return res.status(404).json({ message: "Screening not found for update" });
            }
        }
        else {
            // If screenId is not provided, create a new screening
            screening = await (await screeningFormModel_1.default.create(screeningData)).populate({
                path: 'job',
                model: 'Job'
            });
            if (!screening) {
                return res.status(404).json({ message: "Failed to create AI response, please try again or contact admin." });
            }
        }
        const screeningId = screening._id;
        await applicant.updateOne({
            $push: {
                'documentations.screening': screeningId
            }
        });
        return res.status(200).json({ message: "Analysis Completed!", unparsed: formatResponse, data: screening });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.screenApplicantViaAI = screenApplicantViaAI;
const createScreening = async (req, res) => {
    try {
        const { applicantId } = req.params;
        const { status, recommendation, aiAnalysis } = req.body;
        // Validate applicantId
        if (!applicantId) {
            return res.status(400).json({ message: "Applicant ID is required" });
        }
        // Check if applicant exists
        const applicant = await applicantModel_1.default.findById(applicantId);
        if (!applicant) {
            return res.status(404).json({ message: "Applicant not found" });
        }
        // Validate required fields
        if (!status || !recommendation || !aiAnalysis) {
            return res.status(400).json({
                message: "Missing required fields: status, recommendation, or aiAnalysis",
                data: req.body
            });
        }
        // Validate session and reviewer
        const userId = req.session.user?._id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized - No user session" });
        }
        // Validate aiAnalysis structure
        if (!aiAnalysis.summary ||
            !aiAnalysis.scoreBreakdown ||
            !aiAnalysis.comments ||
            typeof aiAnalysis.scoreBreakdown.experience === 'undefined' ||
            typeof aiAnalysis.scoreBreakdown.education === 'undefined' ||
            typeof aiAnalysis.scoreBreakdown.skills === 'undefined' ||
            typeof aiAnalysis.scoreBreakdown.motivation === 'undefined') {
            return res.status(400).json({ message: "Invalid aiAnalysis structure" });
        }
        // Create screening data
        const data = {
            applicant: new mongoose_1.default.Types.ObjectId(applicantId),
            reviewer: new mongoose_1.default.Types.ObjectId(userId),
            status,
            recommendation,
            aiAnalysis: {
                summary: aiAnalysis.summary,
                scoreBreakdown: {
                    experience: aiAnalysis.scoreBreakdown.experience,
                    education: aiAnalysis.scoreBreakdown.education,
                    skills: aiAnalysis.scoreBreakdown.motivation,
                },
                comments: aiAnalysis.comments,
            }
        };
        if (status === 'shorlisted') {
            applicant.statuses.journey.isShortlisted = true;
        }
        else {
            applicant.statuses.journey.isShortlisted = false;
        }
        await applicant.save();
        // Save screening
        const screening = await screeningFormModel_1.default.create(data);
        if (!screening) {
            return res.status(500).json({ message: "Failed to create screening" });
        }
        res.status(200).json({
            message: "Screening created successfully",
            screening
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.createScreening = createScreening;
const updateScreening = async (req, res) => {
    try {
        const { screeningId } = req.params;
        const updateData = req.body;
        // Validate screeningId
        if (!screeningId) {
            return res.status(400).json({ message: "Screening ID is required" });
        }
        // Check if screening exists
        const existingScreening = await screeningFormModel_1.default.findById(screeningId);
        if (!existingScreening) {
            return res.status(404).json({ message: "Screening record not found" });
        }
        const applicantId = existingScreening.applicant;
        const applicant = await applicantModel_1.default.findById(applicantId);
        if (!applicant) {
            return res.status(404).json({ message: "Applicant not found" });
        }
        // Validate session and permissions
        const userId = req.session.user?._id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized - No user session" });
        }
        // Check if the current user is the original reviewer
        if (!existingScreening.reviewer.equals(userId)) {
            return res.status(403).json({
                message: "Forbidden - You can only update screenings you created"
            });
        }
        // Validate update data structure
        if (updateData.aiAnalysis) {
            if ((updateData.aiAnalysis.scoreBreakdown &&
                (typeof updateData.aiAnalysis.scoreBreakdown.experience === 'undefined' ||
                    typeof updateData.aiAnalysis.scoreBreakdown.education === 'undefined' ||
                    typeof updateData.aiAnalysis.scoreBreakdown.skills === 'undefined' ||
                    typeof updateData.aiAnalysis.scoreBreakdown.motivation === 'undefined'))) {
                return res.status(400).json({ message: "Invalid score breakdown structure" });
            }
        }
        // Prepare update object (only allowed fields)
        const allowedUpdates = {
            status: updateData.status,
            recommendation: updateData.recommendation,
            ...(updateData.aiAnalysis && {
                aiAnalysis: {
                    summary: updateData.aiAnalysis.summary || existingScreening.aiAnalysis.summary,
                    scoreBreakdown: {
                        experience: updateData.aiAnalysis.scoreBreakdown?.experience || existingScreening.aiAnalysis.scoreBreakdown.experience,
                        education: updateData.aiAnalysis.scoreBreakdown?.education || existingScreening.aiAnalysis.scoreBreakdown.education,
                        skills: updateData.aiAnalysis.scoreBreakdown?.skills || existingScreening.aiAnalysis.scoreBreakdown.skills,
                        motivation: updateData.aiAnalysis.scoreBreakdown?.motivation || existingScreening.aiAnalysis.scoreBreakdown.motivation,
                    },
                    comments: updateData.aiAnalysis.comments || existingScreening.aiAnalysis.comments
                }
            })
        };
        // Update screening
        const updatedScreening = await screeningFormModel_1.default.findByIdAndUpdate(screeningId, { $set: allowedUpdates }, { new: true, runValidators: true });
        if (!updatedScreening) {
            return res.status(500).json({ message: "Failed to update screening" });
        }
        // Update applicant isShortlisted field based on status
        logger_1.default.info("Status");
        logger_1.default.info(updateData.status);
        if (updateData.status === 'shortlisted') {
            applicant.statuses.journey.isShortlisted = true;
        }
        else {
            applicant.statuses.journey.isShortlisted = false;
        }
        // Save the updated applicant data
        await applicant.save();
        res.status(200).json({
            message: "Screening updated successfully",
            screening: updatedScreening
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.updateScreening = updateScreening;
const getAllScreening = async (req, res) => {
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
                { 'aiAnalysis.summary': { $regex: searchQuery, $options: "i" } },
                { 'aiAnalysis.comments': { $regex: searchQuery, $options: "i" } },
            ];
        }
        // Get the screening forms with pagination
        const [screeningForms, totalItems] = await Promise.all([
            screeningFormModel_1.default.find(searchFilter)
                .populate([
                {
                    path: "applicant",
                    model: "Applicant",
                    select: "_id firstname lastname"
                },
                {
                    path: "reviewer",
                    model: "User",
                    select: "_id firstname lastname"
                },
                {
                    path: "job",
                    model: "Job"
                }
            ])
                .sort({ createdAt: sortOrder })
                .skip(skip)
                .limit(limit)
                .lean(),
            screeningFormModel_1.default.countDocuments(searchFilter)
        ]);
        const totalPages = Math.ceil(totalItems / limit);
        return res.status(200).json({
            data: screeningForms,
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
exports.getAllScreening = getAllScreening;
