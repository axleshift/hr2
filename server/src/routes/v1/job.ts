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
    },
    true,
  ),
  createJob
);

router.put(
  "/:jobId",
  verifySession(
    {
      permissions: ["admin", "manager", "recruiter"],
    },
    true,
  ),
  updateJob
);

router.get(
  "/all",
  verifySession(
    {
      permissions: ["admin", "manager", "recruiter"],
    },
    true,
  ),
  getAllJob
);

router.get(
  "/:jobId",
  verifySession(
    {
      permissions: ["admin", "manager", "recruiter"],
    },
    true,
  ),
  getJobById
);

router.delete(
  "/:jobId",
  verifySession(
    {
      permissions: ["admin", "manager", "recruiter"],
    },
    true,
  ),
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
