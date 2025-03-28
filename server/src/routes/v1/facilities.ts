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
  },
    true,
  ),
  createFacility
);

router.put(
  "/update/:facilityId",
  verifySession({
    permissions: ["admin", "manager"],
  },
    true,
  ),
  updateFacility
);

router.get(
  "/all",
  verifySession({
    permissions: ["admin", "manager", "recruiter"],
  },
    true,
  ),
  getAllFacilities
);

router.get(
  "/:facilityId",
  verifySession({
    permissions: ["admin", "manager", "recruiter"],
  },
    true,
  ),
  getFacilityById
);

router.delete(
  "/delete/:facilityId",
  verifySession({
    permissions: ["admin", "manager"],
  },
    true,
  ),
  removeFacility
);

// Timeslots
router.post(
  "/timeslot/create/:facilityId",
  verifySession({
    permissions: ["admin", "manager"],
  },
    true,
  ),
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
  },
    true,
  ),
  removeFacilityTimeslot
);

// Event Management
router.post(
  "/event/:timeslotId",
  verifySession({
    permissions: ["admin", "manager", "recruiter"],
  },
    true,
  ),
  createFacilityEvent
);

router.put(
  "/event/:timeslotId",
  verifySession({
    permissions: ["admin", "manager"]
  },
    true,
  ),
  updateFacilityEvent
);

router.delete(
  "/event/:timeslotId",
  verifySession({
    permissions: ["admin", "manager"]
  },
    true,
  ),
  deleteFacilityEvent
);

router.get(
  "/events/:eventId/calendar-states",
  verifySession({
    permissions: ["admin", "manager", "recruiter", "interviewer"],
  },
    true,
  ),
  getFacilityCalendarStates
);

router.get(
  "/event/:eventId",
  verifySession({
    permissions: ["admin", "manager", "recruiter", "interviewer"]
  },
    true,
  ),
  getFacilityEventByID
);

router.get(
  "/events/:eventId/:date",
  verifySession({
    permissions: ["admin", "manager", "recruiter", "interviewer"],
  },
    true,
  ),
  getFacilityEventsForDate
);

router.get(
  "/events/upcoming",
  verifySession({
    permissions: ["admin", "manager", "recruiter", "interviewer"],
  },
    true,
  ),
  getUpcomingEvents
);

// Booking
router.post(
  "/events/:eventId/book",
  verifySession({
    permissions: ["admin", "manager", "recruiter"],
  },
    true,
  ),
  bookApplicantToEvent
);

router.post(
  "/events/:eventId/send-email",
  verifySession({
    permissions: ["admin", "manager"],
  },
    true,
  ),
  SendEmailToFacilityEventParticipants
);

router.delete(
  "/events/:eventId/unbook",
  verifySession({
    permissions: ["admin", "manager", "recruiter"],
  },
    true,
  ),
  unbookApplicantFromEvent
);

export default {
  metadata: {
    path: "/facilities",
    description: "Facilities routes",
  },
  router,
};
