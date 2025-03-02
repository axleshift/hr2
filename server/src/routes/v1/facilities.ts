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
  createFacilityEvent,
  updateFacilityEvent,
  getFacilityEventsByIdAndDate
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

// Facilitiy events

router.post(
  "/event/:id",
  verifySession({
    permissions: ["webhook", "admin", "instructor"],
  }),
  createFacilityEvent
)

router.put(
  "/event/:id",
  verifySession({
    permissions: ["webhook", "admin", "instructor"],
  }),
  updateFacilityEvent
)

router.get(
  "/events/:id/date/:date",
  verifySession({
    permissions: ["webhook", "admin", "instructor"],
  }),
  getFacilityEventsByIdAndDate
);


export default {
  metadata: {
    path: "/facilities",
    description: "Facilities routes",
  },
  router,
};
