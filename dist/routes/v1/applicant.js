"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const verifySession_1 = __importDefault(require("../../middlewares/verifySession"));
const applicantController_1 = require("../../database/v1/controllers/applicantController");
const screeningController_1 = require("../../database/v1/controllers/screeningController");
const interviewController_1 = require("../../database/v1/controllers/interviewController");
const facilityController_1 = require("../../database/v1/controllers/facilityController");
const jobofferController_1 = require("../../database/v1/controllers/jobofferController");
const fileUploadHandler_1 = require("../../utils/fileUploadHandler");
const multer_1 = __importDefault(require("multer"));
const uploader = (0, fileUploadHandler_1.upload)('applicants');
router.post("/", (0, verifySession_1.default)({
    permissions: ["applicant", "admin", "manager"],
}), applicantController_1.addApplicant);
router.put("/:id", (0, verifySession_1.default)({
    permissions: ["applicant", "admin", "manager", "recruiter", "interviewer"],
}), uploader.fields([
    { name: "resume", maxCount: 1 },
    { name: "medCert", maxCount: 1 },
    { name: "birthCert", maxCount: 1 },
    { name: "NBIClearance", maxCount: 1 },
    { name: "policeClearance", maxCount: 1 },
    { name: "TOR", maxCount: 1 },
    { name: "idPhoto", maxCount: 1 },
]), (err, req, res, next) => {
    if (err) {
        // Check for specific Multer errors
        if (err instanceof multer_1.default.MulterError) {
            // Handle Multer specific errors
            return res.status(400).send({ message: err.message });
        }
        // Handle general errors
        return res.status(500).send({ message: "Something went wrong!" });
    }
    next();
}, applicantController_1.updateApplicant);
router.put("/status/:applicantId/:stat", (0, verifySession_1.default)({
    permissions: ["applicant", "admin", "manager", "recruiter", "interviewer"],
}), applicantController_1.updateStat);
router.get("/all", (0, verifySession_1.default)({
    permissions: ["admin", "manager", "recruiter"],
}), applicantController_1.getAllApplicant);
router.get("/category/:category", (0, verifySession_1.default)({
    permissions: ["admin", "manager", "recruiter"],
}), applicantController_1.getApplicantByDocumentCategory);
router.get("/search", (0, verifySession_1.default)({
    permissions: ["admin", "manager", "recruiter"],
}), applicantController_1.searchApplicant);
router.get("/:id", (0, verifySession_1.default)({
    permissions: ["admin", "manager", "recruiter", "interviewer", "applicant"],
}), applicantController_1.getApplicantById);
router.get("/:id/reject", (0, verifySession_1.default)({
    permissions: ["admin", "manager", "recruiter", "interviewer", "applicant"],
}), applicantController_1.rejectApplicant);
router.delete("/:id", (0, verifySession_1.default)({
    permissions: ["admin", "manager"],
}), applicantController_1.deleteApplicant);
// Events
router.get("/events/:applicantId", (0, verifySession_1.default)({
    permissions: ["admin", "manager", "recruiter", "interviewer", "applicant"],
}), facilityController_1.getAllApplicantFacilityEvents);
// Screening
router.post("/screen/:applicantId", (0, verifySession_1.default)({
    permissions: ["admin", "manager", "recruiter", "interviewer", "applicant"],
}), screeningController_1.createScreening);
router.put("/screen/:screeningId", (0, verifySession_1.default)({
    permissions: ["admin", "manager", "recruiter", "interviewer", "applicant"],
}), screeningController_1.updateScreening);
router.get("/screen/ai/:applicantId/:jobId", (0, verifySession_1.default)({
    permissions: ["admin", "manager", "recruiter", "interviewer", "applicant"],
}), screeningController_1.screenApplicantViaAI);
router.get("/screen/ai/:applicantId/:jobId/:screeningId", (0, verifySession_1.default)({
    permissions: ["admin", "manager", "recruiter", "interviewer", "applicant"],
}), screeningController_1.screenApplicantViaAI);
router.get("/screen/all/:applicantId", (0, verifySession_1.default)({
    permissions: ["admin", "manager", "recruiter", "interviewer", "applicant"],
}), screeningController_1.getAllScreening);
// interview
router.post("/interview/:applicantId/:eventId", (0, verifySession_1.default)({
    permissions: ["admin", "manager", "recruiter", "interviewer", "applicant"],
}), interviewController_1.createInterview);
router.put("/interview/:interviewId", (0, verifySession_1.default)({
    permissions: ["admin", "manager", "recruiter", "interviewer", "applicant"],
}), interviewController_1.updateInterview);
router.get("/interview/all/:applicantId", (0, verifySession_1.default)({
    permissions: ["admin", "manager", "recruiter", "interviewer", "applicant"],
}), interviewController_1.getAllInterview);
router.get("/interview/recent", (0, verifySession_1.default)({
    permissions: ["admin", "manager", "recruiter", "interviewer"],
}), interviewController_1.getAllRecentInterviews);
router.get("/interview/:interviewId", (0, verifySession_1.default)({
    permissions: ["admin", "manager", "recruiter", "interviewer"],
}), interviewController_1.getAllInterview);
// job offer
router.post("/joboffer/:applicantId/", (0, verifySession_1.default)({
    permissions: ["admin", "manager", "recruiter"],
}), jobofferController_1.createJoboffer);
router.post("/joboffer/send-email/:jobofferId", (0, verifySession_1.default)({
    permissions: ["admin", "manager", "recruiter"],
}), jobofferController_1.sendJobOfferMail);
router.put("/joboffer/:jobofferId/", (0, verifySession_1.default)({
    permissions: ["admin", "manager", "recruiter"],
}), jobofferController_1.updateJoboffer);
router.get("/joboffer/all/", (0, verifySession_1.default)({
    permissions: ["admin", "manager", "recruiter"],
}), applicantController_1.getEligibleForJobOffer);
router.get("/joboffer/all/:applicantId/", (0, verifySession_1.default)({
    permissions: ["admin", "manager", "recruiter"],
}), jobofferController_1.getApplicantJoboffer);
router.get("/joboffer/recent/", (0, verifySession_1.default)({
    permissions: ["admin", "manager", "recruiter"],
}), jobofferController_1.getAllRecentJoboffer);
router.get("/joboffer/:applicantId", (0, verifySession_1.default)({
    permissions: ["admin", "manager", "recruiter"],
}), jobofferController_1.getJobofferById);
//
router.get("/:applicantId/file/:fileType", (0, verifySession_1.default)({
    permissions: ["admin", "manager", "recruiter", "interviewer"],
}), applicantController_1.getFile);
router.post("/file/:applicantId/interview/:fileType", (0, verifySession_1.default)({
    permissions: ["admin", "manager", "recruiter", "interviewer"],
}), (0, fileUploadHandler_1.upload)('applicants').single('file'), applicantController_1.uploadFile);
exports.default = {
    metadata: {
        path: "/applicant",
        method: ["POST", "GET"],
        description: "This route is used to add, update, delete, get all, get by ID, search, and download resume data",
    },
    router,
};
