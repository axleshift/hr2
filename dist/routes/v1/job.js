"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const verifySession_1 = __importDefault(require("../../middlewares/verifySession"));
const jobController_1 = require("../../database/v1/controllers/jobController");
router.post("/", (0, verifySession_1.default)({
    permissions: ["admin", "manager", "recruiter"],
}), jobController_1.createJob);
router.put("/:jobId", (0, verifySession_1.default)({
    permissions: ["admin", "manager", "recruiter"],
}), jobController_1.updateJob);
router.get("/all", (0, verifySession_1.default)({
    permissions: ["admin", "manager", "recruiter"],
}), jobController_1.getAllJob);
router.get("/:jobId", (0, verifySession_1.default)({
    permissions: ["admin", "manager", "recruiter"],
}), jobController_1.getJobById);
router.delete("/:jobId", (0, verifySession_1.default)({
    permissions: ["admin", "manager", "recruiter"],
}), (req, res) => {
    res.send("OK");
});
exports.default = {
    metadata: {
        path: "/job",
        description: "Job management route",
    },
    router,
};
