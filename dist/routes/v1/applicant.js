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
router.post("/", (0, verifySession_1.default)({
    permissions: ["applicant", "admin", "manager"],
}, true), applicantController_1.addNewResume);
router.put("/:id", (0, verifySession_1.default)({
    permissions: ["applicant", "admin", "manager", "recruiter", "interviewer"],
}, true), applicantController_1.updateResume);
router.get("/all", (0, verifySession_1.default)({
    permissions: ["admin", "manager", "recruiter"],
}, true), applicantController_1.getAllResumeData);
router.get("/category/:category", (0, verifySession_1.default)({
    permissions: ["admin", "manager", "recruiter"],
}, true), applicantController_1.getApplicantByDocumentCategory);
router.get("/download/:id", (0, verifySession_1.default)({
    permissions: ["admin", "manager", "recruiter", "interviewer"],
}, true), applicantController_1.getResumeFile);
router.get("/search", (0, verifySession_1.default)({
    permissions: ["admin", "manager", "recruiter"],
}, true), applicantController_1.searchResume);
router.get("/:id", (0, verifySession_1.default)({
    permissions: ["admin", "manager", "recruiter", "interviewer", "applicant"],
}, true), applicantController_1.getResumeById);
router.delete("/:id", (0, verifySession_1.default)({
    permissions: ["admin", "manager"],
}, true), applicantController_1.deleteResume);
// Screening
router.post("/screen/:applicantId", (0, verifySession_1.default)({
    permissions: ["admin", "manager", "recruiter", "interviewer", "applicant"],
}, true), screeningController_1.createScreening);
router.put("/screen/:screeningId", (0, verifySession_1.default)({
    permissions: ["admin", "manager", "recruiter", "interviewer", "applicant"],
}, true), screeningController_1.updateScreening);
router.get("/screen/ai/:applicantId/:jobId", (0, verifySession_1.default)({
    permissions: ["admin", "manager", "recruiter", "interviewer", "applicant"],
}, true), screeningController_1.screenApplicantViaAI);
router.get("/screen/ai/:applicantId/:jobId/:screeningId", (0, verifySession_1.default)({
    permissions: ["admin", "manager", "recruiter", "interviewer", "applicant"],
}, true), screeningController_1.screenApplicantViaAI);
router.get("/screen/all/:applicantId", (0, verifySession_1.default)({
    permissions: ["admin", "manager", "recruiter", "interviewer", "applicant"],
}, true), screeningController_1.getAllScreening);
// interview
router.post("/interview/:applicantId/:eventId", (0, verifySession_1.default)({
    permissions: ["admin", "manager", "recruiter", "interviewer", "applicant"],
}, true), interviewController_1.createInterview);
router.put("/interview/:interviewId", (0, verifySession_1.default)({
    permissions: ["admin", "manager", "recruiter", "interviewer", "applicant"],
}, true), interviewController_1.updateInterview);
router.get("/interview/all/:applicantId", (0, verifySession_1.default)({
    permissions: ["admin", "manager", "recruiter", "interviewer", "applicant"],
}, true), interviewController_1.getAllInterview);
exports.default = {
    metadata: {
        path: "/applicant",
        method: ["POST", "GET"],
        description: "This route is used to add, update, delete, get all, get by ID, search, and download resume data",
    },
    router,
};
