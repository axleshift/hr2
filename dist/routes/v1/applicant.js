"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const verifySession_1 = __importDefault(require("../../middlewares/verifySession"));
const applicantController_1 = require("../../database/v1/controllers/applicantController");
router.post("/", (0, verifySession_1.default)({
    permissions: ["admin", "superadmin"],
}, true, true), applicantController_1.addNewResume);
router.put("/:id", (0, verifySession_1.default)({
    permissions: ["admin", "superadmin"],
}, true, true), applicantController_1.updateResume);
router.get("/all", (0, verifySession_1.default)({
    permissions: ["admin", "superadmin"],
}, true, true), applicantController_1.getAllResumeData);
router.get("/category/:category", (0, verifySession_1.default)({
    permissions: ["admin", "superadmin"],
}, true, true), applicantController_1.getApplicantByDocumentCategory);
router.get("/download/:id", (0, verifySession_1.default)({
    permissions: ["admin", "superadmin"],
}, true, true), applicantController_1.getResumeFile);
router.get("/search", (0, verifySession_1.default)({
    permissions: ["admin", "superadmin"],
}, true, true), applicantController_1.searchResume);
router.get("/:id", (0, verifySession_1.default)({
    permissions: ["admin", "superadmin"],
}, true, true), applicantController_1.getResumeById);
router.delete("/:id", (0, verifySession_1.default)({
    permissions: ["admin", "superadmin"],
}, true, true), applicantController_1.deleteResume);
exports.default = {
    metadata: {
        path: "/applicant",
        method: ["POST", "GET"],
        description: "This route is used to add, update, delete, get all, get by id, search and download resume data",
        permissions: ["admin", "superadmin"],
    },
    router,
};
