import { Router } from "express";
const router = Router();

import dotenv from "dotenv";
dotenv.config();

import { createUser, login, logout } from "../database/controllers/authController";

router.post("/register", createUser);
router.post("/login", login);
router.get("/logout", logout);

export default router;
