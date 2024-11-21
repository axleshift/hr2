"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const interviewController_1 = require("../../database/v1/controllers/interviewController");
const timeslotController_1 = require("../../database/v1/controllers/timeslotController");
router.get("/slots/:year/:month", interviewController_1.getInterviewForAMonth);
router.get("/slots/", timeslotController_1.getAllSlotsForADate);
router.get("/slot/:id", timeslotController_1.getSlotById);
router.get("/all/", interviewController_1.getInterviewForADay);
router.post("/slots", timeslotController_1.createSlotForADate);
router.post("/schedule/", interviewController_1.createInterviewForADate);
router.put("/schedule/:id", interviewController_1.updateInterview);
router.delete("/slot/:id", timeslotController_1.deleteSlotById);
router.delete("/schedule/:id", interviewController_1.deleteInterviewById);
exports.default = {
    metadata: {
        path: "/interview",
        method: ["POST", "GET"],
        description: "This route is used to get all interview slots for a month, get all slots for a date, create a slot for a date and create an interview for a date",
        permissions: ["admin"],
    },
    router,
};
