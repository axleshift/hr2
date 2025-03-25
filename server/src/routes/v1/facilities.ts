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
  getFacilityEventsForDate,
  getFacilityCalendarStates,
  getUpcomingEvents,

  // booking
  BookApplicantToEvent,
  getFacilityEventByID,
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
  "/update/:id",
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
  "/:id",
  verifySession({
    permissions: ["user", "admin"],
  },
    true,
    true
  ),
  getFacilityById
);

router.delete(
  "/delete/:id",
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
  "/timeslot/create/:id",
  verifySession({
    permissions: ["user", "admin"],
  },
    true,
    true
  ),
  createFacilityTimeslot
);

router.get(
  "/timeslot/:id/:date",
  verifySession({
    permissions: ["user", "admin"],
  }),
  getAllFacilityTimeslotsForDate
);

router.delete(
  "/timeslot/delete/:id",
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
  "/event/timeslot/:timeslotId",
  verifySession({
    permissions: ["user", "admin"],
  },
    true,
    true
  ),
  createFacilityEvent
)

router.put(
  "/event/timeslot/:timeslotId",
  verifySession({
    permissions: ["user", "admin"]
  },
    true,
    true
  ),
  updateFacilityEvent
)

router.get(
  "/events/:id/calendar-states",
  verifySession({
    permissions: ["user", "admin"],
  },
    true,
    true
  ),
  getFacilityCalendarStates
)

router.get(
  "/event/:id",
  verifySession({
    permissions: ["user", "admin"]
  },
    true,
    true
  ),
  getFacilityEventByID
)

router.get(
  "/events/:id/:date",
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
  "/events/:id/book",
  verifySession({
    permissions: ["user", "admin"],
  },
    true,
    true
  ),
  BookApplicantToEvent
)


export default {
  metadata: {
    path: "/facilities",
    description: "Facilities routes",
  },
  router,
};
