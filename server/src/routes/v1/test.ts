import { Router } from "express";
const router = Router();

import dotenv from "dotenv";
dotenv.config();

import { createTest, getAllTests } from "../../database/controllers/testController";

router.post("/", createTest);
router.get("/", getAllTests);

export default router;
