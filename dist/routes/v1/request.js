"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const requestController_1 = require("../..//database/v1/controllers/requestController");
router.post("/jobposting", requestController_1.externalPostJob);
router.get("/applicants/documents/:documentType", requestController_1.getApplicantDocuments);
exports.default = {
    metadata: {
        path: "/request",
        description: "This route is used to create, search, get and update jobposting requests",
    },
    router,
};
