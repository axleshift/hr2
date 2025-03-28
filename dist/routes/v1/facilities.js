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
router.put("/update/:facilityId", (0, verifySession_1.default)({
    permissions: ["user", "admin"],
}, true, true), facilityController_1.updateFacility);
router.get("/all", (0, verifySession_1.default)({
    permissions: ["user", "admin"],
}, true, true), facilityController_1.getAllFacilities);
router.get("/:facilityId", (0, verifySession_1.default)({
    permissions: ["user", "admin"],
}, true, true), facilityController_1.getFacilityById);
router.delete("/delete/:facilityId", (0, verifySession_1.default)({
    permissions: ["user", "admin"],
}, true, true), facilityController_1.removeFacility);
// Timeslots
router.post("/timeslot/create/:facilityId", (0, verifySession_1.default)({
    permissions: ["user", "admin"],
}, true, true), facilityController_1.createFacilityTimeslot);
router.get("/timeslot/:facilityId/:date", (0, verifySession_1.default)({
    permissions: ["user", "admin"],
}), facilityController_1.getAllFacilityTimeslotsForDate);
router.delete("/timeslot/delete/:timeslotId", (0, verifySession_1.default)({
    permissions: ["user", "admin"],
}, true, true), facilityController_1.removeFacilityTimeslot);
// Event
router.post("/event/:timeslotId", (0, verifySession_1.default)({
    permissions: ["user", "admin"],
}, true, true), facilityController_1.createFacilityEvent);
router.put("/event/:timeslotId", (0, verifySession_1.default)({
    permissions: ["user", "admin"]
}, true, true), facilityController_1.updateFacilityEvent);
router.delete("/event/:timeslotId", (0, verifySession_1.default)({
    permissions: ["user", "admin"]
}, true, true), facilityController_1.deleteFacilityEvent);
router.get("/events/:eventId/calendar-states", (0, verifySession_1.default)({
    permissions: ["user", "admin"],
}, true, true), facilityController_1.getFacilityCalendarStates);
router.get("/event/:eventId", (0, verifySession_1.default)({
    permissions: ["user", "admin"]
}, true, true), facilityController_1.getFacilityEventByID);
router.get("/events/:eventId/:date", (0, verifySession_1.default)({
    permissions: ["user", "admin"],
}, true, true), facilityController_1.getFacilityEventsForDate);
router.get("/events/upcoming", (0, verifySession_1.default)({
    permissions: ["user", "admin"],
}, true, true), facilityController_1.getUpcomingEvents);
// Booking
router.post("/events/:eventId/book", (0, verifySession_1.default)({
    permissions: ["user", "admin"],
}, true, true), facilityController_1.bookApplicantToEvent);
router.post("/events/:eventId/send-email", (0, verifySession_1.default)({
    permissions: ["user", "admin"],
}, true, true), facilityController_1.SendEmailToFacilityEventParticipants);
router.delete("/events/:eventId/unbook", (0, verifySession_1.default)({
    permissions: ["user", "admin"],
}, true, true), facilityController_1.unbookApplicantFromEvent);
exports.default = {
    metadata: {
        path: "/facilities",
        description: "Facilities routes",
    },
    router,
};
