import { Router } from "express";
const router = Router();

import dotenv from "dotenv";
dotenv.config();

import { createJobposter, getJobposterById, removeJobposter } from "../database/controllers/jobposterController";

router.post("/:id/post", createJobposter);
router.get("/:id", getJobposterById);
router.post("/:id/delete", removeJobposter);

export default router;
