import { Router } from "express";
const router = Router();

import dotenv from "dotenv";
import verifySession from "../../middlewares/verifySession";
import { statistics } from "../../database/v1/controllers/statisticController";
dotenv.config();

router.get(
  "/",
  verifySession({
    permissions: ["admin", "manager", "recruiter"],
  }),
  statistics
);

export default {
  metadata: {
    path: "/stats",
    description: "Test route",
  },
  router,
};
