import { Router } from "express";
const router = Router();

import dotenv from "dotenv";
dotenv.config();

import { createJobposter, getJobposterByRefId, removeJobposter } from "../database/controllers/jobposterController";

router.post("/:id/post", createJobposter);
router.get("/:id", getJobposterByRefId);
router.delete("/:id", removeJobposter);

export default router;
