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
const facilityController_1 = require("../../database/v1/controllers/facilityController");
router.post("/create", (0, verifySession_1.default)({
    permissions: ["user", "admin"],
}, true, true), facilityController_1.createFacility);
router.put("/update/:id", (0, verifySession_1.default)({
    permissions: ["user", "admin"],
}, true, true), facilityController_1.updateFacility);
router.get("/all", (0, verifySession_1.default)({
    permissions: ["user", "admin"],
}, true, true), facilityController_1.getAllFacilities);
router.get("/:id", (0, verifySession_1.default)({
    permissions: ["user", "admin"],
}, true, true), facilityController_1.getFacilityById);
router.delete("/delete/:id", (0, verifySession_1.default)({
    permissions: ["user", "admin"],
}, true, true), facilityController_1.removeFacility);
// Timeslots
router.post("/timeslot/create/:id", (0, verifySession_1.default)({
    permissions: ["user", "admin"],
}, true, true), facilityController_1.createFacilityTimeslot);
router.get("/timeslot/:id/:date", (0, verifySession_1.default)({
    permissions: ["user", "admin"],
}), facilityController_1.getAllFacilityTimeslotsForDate);
router.delete("/timeslot/delete/:id", (0, verifySession_1.default)({
    permissions: ["user", "admin"],
}, true, true), facilityController_1.removeFacilityTimeslot);
// Event
router.post("/event/timeslot/:timeslotId", (0, verifySession_1.default)({
    permissions: ["user", "admin"],
}, true, true), facilityController_1.createFacilityEvent);
router.put("/event/timeslot/:timeslotId", (0, verifySession_1.default)({
    permissions: ["user", "admin"]
}, true, true), facilityController_1.updateFacilityEvent);
router.get("/events/:id/calendar-states", (0, verifySession_1.default)({
    permissions: ["user", "admin"],
}, true, true), facilityController_1.getFacilityCalendarStates);
router.get("/event/:id", (0, verifySession_1.default)({
    permissions: ["user", "admin"]
}, true, true), facilityController_1.getFacilityEventByID);
router.get("/events/:id/:date", (0, verifySession_1.default)({
    permissions: ["user", "admin"],
}, true, true), facilityController_1.getFacilityEventsForDate);
router.post("/events/:id/book", (0, verifySession_1.default)({
    permissions: ["user", "admin"],
}, true, true), facilityController_1.BookApplicantToEvent);
exports.default = {
    metadata: {
        path: "/facilities",
        description: "Facilities routes",
    },
    router,
};
