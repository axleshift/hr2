import { Router } from "express";
const router = Router();

import dotenv from "dotenv";
dotenv.config();

import { getInterviewForAMonth, getInterviewForADay, createInterviewForADate, updateInterview, deleteInterviewById } from "../../database/v1/controllers/interviewController";
import { getAllSlotsForADate, getSlotById, createSlotForADate, deleteSlotById } from "../../database/v1/controllers/timeslotController";

router.get("/slots/:year/:month", getInterviewForAMonth);
router.get("/slots/", getAllSlotsForADate);
router.get("/slot/:id", getSlotById);
router.get("/all/", getInterviewForADay);

router.post("/slots", createSlotForADate);
router.post("/schedule/", createInterviewForADate);

router.put("/schedule/:id", updateInterview);

router.delete("/slot/:id", deleteSlotById);
router.delete("/schedule/:id", deleteInterviewById);

export default {
    metadata: {
        path: "/interview",
        method: ["POST", "GET"],
        description: "This route is used to get all interview slots for a month, get all slots for a date, create a slot for a date and create an interview for a date",
        permissions: ["admin"],
    },
    router,
};
