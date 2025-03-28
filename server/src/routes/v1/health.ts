import { Router } from "express";
const router = Router();

import dotenv from "dotenv";
dotenv.config();

import verifySession from "../../middlewares/verifySession";

router.get(
  "/",
  verifySession(
    {
      permissions: ["user", "admin"],
    },
    true,
  ),
  (req, res) => {
    res.send("OK");
  }
);

export default {
  metadata: {
    path: "/health",
    description: "Health route",
  },
  router,
};
