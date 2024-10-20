"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jobpostingController_1 = require("../../database/v1/controllers/jobpostingController");
router.post("/", jobpostingController_1.createJobposting);
router.get("/search", jobpostingController_1.searchJobpostings);
router.get("/", jobpostingController_1.getAllJobpostings);
router.get("/scheduled", jobpostingController_1.getAllScheduledJobpostings);
router.get("/:id", jobpostingController_1.getJobpostingById);
router.put("/:id", jobpostingController_1.updateJobposting);
router.delete("/:id", jobpostingController_1.deleteJobposting);
exports.default = {
    metadata: {
        path: "/jobposting",
        method: ["POST", "GET"],
        description: "This route is used to add, update, delete, get all, get by id and search jobposting data",
        permissions: ["admin"],
    },
    router,
};
