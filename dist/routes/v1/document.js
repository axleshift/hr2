"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const verifySession_1 = __importDefault(require("../../middlewares/verifySession"));
const documentController_1 = require("../../database/v1/controllers/documentController");
const allowedRoles = ["admin", "manager", "recruiter", "interviewer"];
router.post("/create", (0, verifySession_1.default)({
    permissions: allowedRoles,
}, true), documentController_1.createDocument);
router.put("/update/:id", (0, verifySession_1.default)({
    permissions: allowedRoles,
}, true), documentController_1.updateDocument);
router.get("/:id", (0, verifySession_1.default)({
    permissions: allowedRoles,
}, true), documentController_1.getDocumentById);
router.get("/applicant/:applicantId/:category", (0, verifySession_1.default)({
    permissions: allowedRoles,
}, true), documentController_1.getDocumentByApplicantId);
router.get("/category/:category", (0, verifySession_1.default)({
    permissions: allowedRoles,
}, true), documentController_1.getDocumentByCategory);
router.get("/search", (0, verifySession_1.default)({
    permissions: allowedRoles,
}, true), documentController_1.searchDocument);
exports.default = {
    metadata: {
        path: "/document",
        description: "",
    },
    router,
};
