import { Router } from "express";
const router = Router();

import dotenv from "dotenv";
dotenv.config();

import { createUser, verifyUser } from "../database/controllers/authController";

router.post("/register", createUser);
router.post("/login", verifyUser);

export default router;
