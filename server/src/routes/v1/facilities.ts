import { Router } from "express";
const router = Router();

import dotenv from "dotenv";
dotenv.config();
import verifySession from "../../middlewares/verifySession";
import {
  createFacility,
  updateFacility,
  getAllFacilities,
  getFacilityById,
  removeFacility,

  // timeslot
  createFacilityTimeslot,
  getAllFacilityTimeslotsForDate,
  removeFacilityTimeslot,

  // event
  createFacilityEvent,
  updateFacilityEvent,
  deleteFacilityEvent,
  getFacilityEventsForDate,
  getFacilityCalendarStates,
  getUpcomingEvents,

  // booking
  bookApplicantToEvent,
  unbookApplicantFromEvent,
  getFacilityEventByID,

  // Emailing
  SendEmailToFacilityEventParticipants,
} from "../../database/v1/controllers/facilityController";

// Facility Management
router.post(
  "/create",
  verifySession({
    permissions: ["admin", "manager"],
  }),
  createFacility
);

router.put(
  "/update/:facilityId",
  verifySession({
    permissions: ["admin", "manager"],
  }),
  updateFacility
);

router.get(
  "/all",
  verifySession({
    permissions: ["admin", "manager", "recruiter"],
  }),
  getAllFacilities
);

router.get(
  "/:facilityId",
  verifySession({
    permissions: ["admin", "manager", "recruiter"],
  }),
  getFacilityById
);

router.delete(
  "/delete/:facilityId",
  verifySession({
    permissions: ["admin", "manager"],
  }),
  removeFacility
);

// Timeslots
router.post(
  "/timeslot/create/:facilityId",
  verifySession({
    permissions: ["admin", "manager"],
  }),
  createFacilityTimeslot
);

router.get(
  "/timeslot/:facilityId/:date",
  verifySession({
    permissions: ["admin", "manager", "recruiter", "interviewer"],
  }, true,
  ),
  getAllFacilityTimeslotsForDate
);

router.delete(
  "/timeslot/delete/:timeslotId",
  verifySession({
    permissions: ["admin", "manager"],
  }),
  removeFacilityTimeslot
);

// Event Management
router.post(
  "/event/:timeslotId",
  verifySession({
    permissions: ["admin", "manager", "recruiter"],
  }),
  createFacilityEvent
);

router.put(
  "/event/:timeslotId",
  verifySession({
    permissions: ["admin", "manager"]
  }),
  updateFacilityEvent
);

router.delete(
  "/event/:timeslotId",
  verifySession({
    permissions: ["admin", "manager"]
  }),
  deleteFacilityEvent
);

router.get(
  "/events/:eventId/calendar-states",
  verifySession({
    permissions: ["admin", "manager", "recruiter", "interviewer"],
  }),
  getFacilityCalendarStates
);

router.get(
  "/event/:eventId",
  verifySession({
    permissions: ["admin", "manager", "recruiter", "interviewer"]
  }),
  getFacilityEventByID
);

router.get(
  "/events/:eventId/:date",
  verifySession({
    permissions: ["admin", "manager", "recruiter", "interviewer"],
  }),
  getFacilityEventsForDate
);

router.get(
  "/events/upcoming",
  verifySession({
    permissions: ["admin", "manager", "recruiter", "interviewer"],
  }),
  getUpcomingEvents
);

// Booking
router.post(
  "/events/:eventId/book",
  verifySession({
    permissions: ["admin", "manager", "recruiter"],
  }),
  bookApplicantToEvent
);

router.post(
  "/events/:eventId/send-email",
  verifySession({
    permissions: ["admin", "manager"],
  }),
  SendEmailToFacilityEventParticipants
);

router.delete(
  "/events/:eventId/unbook",
  verifySession({
    permissions: ["admin", "manager", "recruiter"],
  }),
  unbookApplicantFromEvent
);

export default {
  metadata: {
    path: "/facilities",
    description: "Facilities routes",
  },
  router,
};
