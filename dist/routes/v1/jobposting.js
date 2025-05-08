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
const jobpostingController_1 = require("../../database/v1/controllers/jobpostingController");
router.post("/", (0, verifySession_1.default)({
    permissions: ["admin", "manager", "recruiter"],
}), jobpostingController_1.createJobposting);
router.get("/search", (0, verifySession_1.default)({
    permissions: ["admin", "manager", "recruiter"],
}), jobpostingController_1.searchJobpostings);
router.get("/", (0, verifySession_1.default)({
    permissions: ["admin", "manager", "recruiter"],
}), jobpostingController_1.getAllJobpostings);
router.get("/scheduled", (0, verifySession_1.default)({
    permissions: ["admin", "manager", "recruiter"],
}), jobpostingController_1.getAllScheduledJobpostings);
router.get("/:id", (0, verifySession_1.default)({
    permissions: ["admin", "manager", "recruiter"],
}), jobpostingController_1.getJobpostingById);
router.put("/:id", (0, verifySession_1.default)({
    permissions: ["admin", "manager", "recruiter"],
}), jobpostingController_1.updateJobposting);
router.delete("/:id", (0, verifySession_1.default)({
    permissions: ["user", "admin"],
}), jobpostingController_1.deleteJobposting);
exports.default = {
    metadata: {
        path: "/jobposting",
        method: ["POST", "GET"],
        description: "This route is used to add, update, delete, get all, get by id and search jobposting data",
        permissions: ["user", "admin"],
    },
    router,
};
