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
const jobposterController_1 = require("../../database/v1/controllers/jobposterController");
router.post("/:id/post", (0, verifySession_1.default)({
    permissions: ["admin", "manager", "recruiter"],
}), jobposterController_1.createJobposter);
router.get("/all", (0, verifySession_1.default)({
    permissions: ["admin", "manager", "recruiter"],
}), jobposterController_1.getAllJobposters);
router.get("/:id", (0, verifySession_1.default)({
    permissions: ["admin", "manager", "recruiter"],
}), jobposterController_1.getJobposterByRefId);
router.delete("/:id", (0, verifySession_1.default)({
    permissions: ["admin", "manager", "recruiter"],
}), jobposterController_1.removeJobposter);
exports.default = {
    metadata: {
        path: "/jobposter",
        description: "This route is used to add, get by ref id and remove jobposter data",
    },
    router,
};
