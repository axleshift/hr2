import { Router } from "express";
const router = Router();

import dotenv from "dotenv";
dotenv.config();

import {
  createUser,
  verifyUser,
  checkToken,
} from "../database/controllers/userController";

router.post("/register", createUser);
router.post("/login", verifyUser);
router.post("/check-auth", checkToken);

export default router;
