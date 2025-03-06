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
  removeFacilityTimeslot
} from "../../database/v1/controllers/facilityController";

router.post(
  "/create",
  verifySession({
    permissions: ["webhook", "admin", "instructor"],
  }),
  createFacility
);

router.put(
  "/update/:id",
  verifySession({
    permissions: ["webhook", "admin", "instructor"],
  }),
  updateFacility
);

router.get(
  "/all",
  verifySession({
    permissions: ["webhook", "admin", "instructor"],
  }),
  getAllFacilities
);

router.get(
  "/:id",
  verifySession({
    permissions: ["webhook", "admin", "instructor"],
  }),
  getFacilityById
);

router.delete(
  "/delete/:id",
  verifySession({
    permissions: ["webhook", "admin", "instructor"],
  }),
  removeFacility
);


// Timeslots
router.post(
  "/timeslot/create/:id",
  verifySession({
    permissions: ["webhook", "admin", "instructor"],
  }),
  createFacilityTimeslot
);

router.get(
  "/timeslot/:id/:date",
  verifySession({
    permissions: ["webhook", "admin", "instructor"],
  }),
  getAllFacilityTimeslotsForDate
);

router.delete(
  "/timeslot/delete/:id",
  verifySession({
    permissions: ["webhook", "admin", "instructor"],
  }),
  removeFacilityTimeslot
)

export default {
  metadata: {
    path: "/facilities",
    description: "Facilities routes",
  },
  router,
};
