import { Router } from "express";
const router = Router();
import verifySession from "../../middlewares/verifySession";

import { metricsHandler } from "../../middlewares/prometheusMetrics";

import dotenv from "dotenv";
dotenv.config();

router.get(
  "/",
  verifySession({
    permissions: ["admin", "superadmin"],
  },
    true,
    true
  ),
  metricsHandler
);

export default {
  metadata: {
    path: "/metrics",
    description: "Metrics route",
  },
  router,
};
