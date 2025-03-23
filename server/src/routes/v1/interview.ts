import { Router } from "express";
const router = Router();

import dotenv from "dotenv";
dotenv.config();
import verifySession from "../../middlewares/verifySession";

import { getInterviewForAMonth, getInterviewForADay, createInterviewForADate, updateInterview, deleteInterviewById } from "../../database/v1/controllers/interviewController";
import { getAllSlotsForADate, getSlotById, createSlotForADate, deleteSlotById } from "../../database/v1/controllers/timeslotController";

router.get("/slots/:year/:month",
  verifySession({
    permissions: ["user", "admin"],
  },
    true,
    true
  ),
  getInterviewForAMonth);
router.get("/slots/",
  verifySession({
    permissions: ["user", "admin"],
  },
    true,
    true
  ),
  getAllSlotsForADate);
router.get("/slot/:id",
  verifySession({
    permissions: ["user", "admin"],
  },
    true,
    true
  ),
  getSlotById);
router.get("/all/",
  verifySession({
    permissions: ["user", "admin"],
  },
    true,
    true
  ),
  getInterviewForADay);

router.post("/slots",
  verifySession({
    permissions: ["user", "admin"],
  },
    true,
    true
  ),
  createSlotForADate);
router.post("/schedule/",
  verifySession({
    permissions: ["user", "admin"],
  },
    true,
    true
  ),
  createInterviewForADate);

router.put("/schedule/:id",
  verifySession({
    permissions: ["user", "admin"],
  },
    true,
    true
  ),
  updateInterview);

router.delete("/slot/:id",
  verifySession({
    permissions: ["user", "admin"],
  },
    true,
    true
  ),
  deleteSlotById);
router.delete("/schedule/:id",
  verifySession({
    permissions: ["user", "admin"],
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
