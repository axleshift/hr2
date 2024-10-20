"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jobposterController_1 = require("../../database/v1/controllers/jobposterController");
router.post("/:id/post", jobposterController_1.createJobposter);
router.get("/:id", jobposterController_1.getJobposterByRefId);
router.delete("/:id", jobposterController_1.removeJobposter);
exports.default = {
    metadata: {
        path: "/jobposter",
        method: ["POST", "GET"],
        description: "This route is used to add, get by ref id and remove jobposter data",
        permissions: ["admin"],
    },
    router,
};
