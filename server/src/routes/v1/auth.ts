import { Router } from "express";
const router = Router();

import dotenv from "dotenv";
dotenv.config();
import verifySession from "../../middlewares/verifySession";
import { createUser, login, logout, verify } from "../../database/v1/controllers/authController";

router.post(
  "/register",
  verifySession(
    {
      permissions: ["user", "admin"],
    },
    true,
    true
  ),
  createUser
);
router.post(
  "/login",
  verifySession(
    {
      permissions: ["user", "admin"],
    },
    true,
    true
  ),
  login
);
router.get(
  "/logout",
  verifySession({
    permissions: ["user", "admin"],
  },
    true,
    true
  ),
  logout
);
router.get(
  "/verify",
  verifySession({
    permissions: ["user", "admin"],
  }, true, true),
  verify
);

export default {
  metadata: {
    path: "/auth",
    description: "This route is used to register, login, logout and verify user",
  },
  router,
};
