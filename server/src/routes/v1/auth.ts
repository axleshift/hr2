import { Router } from "express";
const router = Router();

import dotenv from "dotenv";
dotenv.config();

import { createUser, login, logout, verify } from "../../database/v1/controllers/authController";

router.post("/register", createUser);
router.post("/login", login);
router.get("/logout", logout);
router.get("/verify", verify);

export default {
    metadata: {
        path: "/auth",
        method: ["POST", "GET"],
        description: "This route is used to register, login, logout and verify user",
        permissions: ["admin", "user", "guest"],
    },
    router,
};
