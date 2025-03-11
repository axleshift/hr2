import { Router } from "express";
const router = Router();

import dotenv from "dotenv";
dotenv.config();
import verifySession from "../../middlewares/verifySession";

import { getInterviewForAMonth, getInterviewForADay, createInterviewForADate, updateInterview, deleteInterviewById } from "../../database/v1/controllers/interviewController";
import { getAllSlotsForADate, getSlotById, createSlotForADate, deleteSlotById } from "../../database/v1/controllers/timeslotController";

router.get("/slots/:year/:month",
  verifySession({
    permissions: ["admin", "superadmin"],
  },
    true,
    true
  ),
  getInterviewForAMonth);
router.get("/slots/",
  verifySession({
    permissions: ["admin", "superadmin"],
  },
    true,
    true
  ),
  getAllSlotsForADate);
router.get("/slot/:id",
  verifySession({
    permissions: ["admin", "superadmin"],
  },
    true,
    true
  ),
  getSlotById);
router.get("/all/",
  verifySession({
    permissions: ["admin", "superadmin"],
  },
    true,
    true
  ),
  getInterviewForADay);

router.post("/slots",
  verifySession({
    permissions: ["admin", "superadmin"],
  },
    true,
    true
  ),
  createSlotForADate);
router.post("/schedule/",
  verifySession({
    permissions: ["admin", "superadmin"],
  },
    true,
    true
  ),
  createInterviewForADate);

router.put("/schedule/:id",
  verifySession({
    permissions: ["admin", "superadmin"],
  },
    true,
    true
  ),
  updateInterview);

router.delete("/slot/:id",
  verifySession({
    permissions: ["admin", "superadmin"],
  },
    true,
    true
  ),
  deleteSlotById);
router.delete("/schedule/:id",
  verifySession({
    permissions: ["admin", "superadmin"],
  },
    true,
    true
  ),
  deleteInterviewById);

export default {
  metadata: {
    path: "/interview",
    description: "This route is used to get all interview slots for a month, get all slots for a date, create a slot for a date and create an interview for a date",
  },
  router,
};
