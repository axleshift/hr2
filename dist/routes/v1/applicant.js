"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const applicantController_1 = require("../../database/v1/controllers/applicantController");
router.post("/", applicantController_1.addNewResume);
router.put("/:id", applicantController_1.updateResume);
router.get("/all", applicantController_1.getAllResumeData);
router.get("/download/:id", applicantController_1.getResumeFile);
router.get("/search", applicantController_1.searchResume);
router.get("/:id", applicantController_1.getResumeById);
router.delete("/:id", applicantController_1.deleteResume);
exports.default = {
    metadata: {
        path: "/applicant",
        method: ["POST", "GET"],
        description: "This route is used to add, update, delete, get all, get by id, search and download resume data",
        permissions: ["admin"],
    },
    router,
};
