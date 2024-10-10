import { Router } from "express";
const router = Router();

import dotenv from "dotenv";
dotenv.config();

import { getInterviewForAMonth, getInterviewForADay, createInterviewForADate } from "../../database/controllers/interviewController";
import { getAllSlotsForADate, getSlotById, createSlotForADate, deleteSlotById } from "../../database/controllers/timeslotController";

router.get("/slots/:year/:month", getInterviewForAMonth);
router.get("/slots/:date", getAllSlotsForADate);
router.get("/slot/:id", getSlotById);
router.get("/all/", getInterviewForADay);

router.post("/slots", createSlotForADate);
router.post("/", createInterviewForADate);

router.delete("/slot/:id", deleteSlotById);

export default {
    metadata: {
        path: "/interview",
        method: ["POST", "GET"],
        description: "This route is used to get all interview slots for a month, get all slots for a date, create a slot for a date and create an interview for a date",
        permissions: ["admin"],
    },
    router,
};
