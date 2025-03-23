import { Router } from "express";
const router = Router();
import { metricsHandler } from "../../middlewares/prometheusMetrics";

import dotenv from "dotenv";
dotenv.config();

router.get(
  "/",
  metricsHandler
);

export default {
  metadata: {
    path: "/metrics",
    description: "Metrics route",
  },
  router,
};
