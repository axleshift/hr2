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

router.post(
  "/create",
  verifySession({
    permissions: ["user", "admin"],
  },
    true,
    true
  ),
  createFacility
);

router.put(
  "/update/:facilityId",
  verifySession({
    permissions: ["user", "admin"],
  },
    true,
    true
  ),
  updateFacility
);

router.get(
  "/all",
  verifySession({
    permissions: ["user", "admin"],
  },
    true,
    true
  ),
  getAllFacilities
);

router.get(
  "/:facilityId",
  verifySession({
    permissions: ["user", "admin"],
  },
    true,
    true
  ),
  getFacilityById
);

router.delete(
  "/delete/:facilityId",
  verifySession({
    permissions: ["user", "admin"],
  },
    true,
    true
  ),
  removeFacility
);


// Timeslots
router.post(
  "/timeslot/create/:facilityId",
  verifySession({
    permissions: ["user", "admin"],
  },
    true,
    true
  ),
  createFacilityTimeslot
);

router.get(
  "/timeslot/:facilityId/:date",
  verifySession({
    permissions: ["user", "admin"],
  }),
  getAllFacilityTimeslotsForDate
);

router.delete(
  "/timeslot/delete/:timeslotId",
  verifySession({
    permissions: ["user", "admin"],
  },
    true,
    true
  ),
  removeFacilityTimeslot
)

// Event

router.post(
  "/event/:timeslotId",
  verifySession({
    permissions: ["user", "admin"],
  },
    true,
    true
  ),
  createFacilityEvent
)

router.put(
  "/event/:timeslotId",
  verifySession({
    permissions: ["user", "admin"]
  },
    true,
    true
  ),
  updateFacilityEvent
)

router.delete(
  "/event/:timeslotId",
  verifySession({
    permissions: ["user", "admin"]
  },
    true,
    true
  ),
  deleteFacilityEvent
)

router.get(
  "/events/:eventId/calendar-states",
  verifySession({
    permissions: ["user", "admin"],
  },
    true,
    true
  ),
  getFacilityCalendarStates
)

router.get(
  "/event/:eventId",
  verifySession({
    permissions: ["user", "admin"]
  },
    true,
    true
  ),
  getFacilityEventByID
)

router.get(
  "/events/:eventId/:date",
  verifySession({
    permissions: ["user", "admin"],
  },
    true,
    true
  ),
  getFacilityEventsForDate
)

router.get(
  "/events/upcoming",
  verifySession({
    permissions: ["user", "admin"],
  },
    true,
    true
  ),
  getUpcomingEvents
)

// Booking

router.post(
  "/events/:eventId/book",
  verifySession({
    permissions: ["user", "admin"],
  },
    true,
    true
  ),
  bookApplicantToEvent
)

router.post(
  "/events/:eventId/send-email",
  verifySession({
    permissions: ["user", "admin"],
  },
    true,
    true
  ),
  SendEmailToFacilityEventParticipants
)

router.delete(
  "/events/:eventId/unbook",
  verifySession({
    permissions: ["user", "admin"],
  },
    true,
    true
  ),
  unbookApplicantFromEvent
)


export default {
  metadata: {
    path: "/facilities",
    description: "Facilities routes",
  },
  router,
};
