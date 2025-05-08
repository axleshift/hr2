import { Router } from "express";
const router = Router();

import verifySession from "../../middlewares/verifySession";
import {
  createJob,
  getAllJob,
  getJobById,
  updateJob,
} from "../../database/v1/controllers/jobController"

router.post(
  "/",
  verifySession(
    {
      permissions: ["admin", "manager", "recruiter"],
    }),
  createJob
);

router.put(
  "/:jobId",
  verifySession(
    {
      permissions: ["admin", "manager", "recruiter"],
    }),
  updateJob
);

router.get(
  "/all",
  verifySession(
    {
      permissions: ["admin", "manager", "recruiter"],
    }),
  getAllJob
);

router.get(
  "/:jobId",
  verifySession(
    {
      permissions: ["admin", "manager", "recruiter"],
    }),
  getJobById
);

router.delete(
  "/:jobId",
  verifySession(
    {
      permissions: ["admin", "manager", "recruiter"],
    }),
  (req, res) => {
    res.send("OK");
  }
);


export default {
  metadata: {
    path: "/job",
    description: "Job management route",
  },
  router,
};
