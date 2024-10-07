import { Router } from "express";
const router = Router();

import dotenv from "dotenv";
dotenv.config();

import { createJobposting, searchJobpostings, getAllJobpostings, getAllScheduledJobpostings, getJobpostingById, updateJobposting, deleteJobposting } from "../../database/controllers/jobpostingController";

router.post("/", createJobposting);
router.get("/search", searchJobpostings);
router.get("/", getAllJobpostings);
router.get("/scheduled", getAllScheduledJobpostings);
router.get("/:id", getJobpostingById);
router.put("/:id", updateJobposting);
router.delete("/:id", deleteJobposting);

export default router;
