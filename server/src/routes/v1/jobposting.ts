import { Router } from "express";
const router = Router();

import dotenv from "dotenv";
dotenv.config();
import verifySession from "../../middlewares/verifySession";

import { createJobposting, searchJobpostings, getAllJobpostings, getAllScheduledJobpostings, getJobpostingById, updateJobposting, deleteJobposting } from "../../database/v1/controllers/jobpostingController";

router.post(
  "/",
  verifySession({
    permissions: ["admin", "superadmin"],
  },
    true,
    true
  ),
  createJobposting
);

router.get(
  "/search",
  verifySession({
    permissions: ["admin", "superadmin"],
  },
    true,
    true
  ),
  searchJobpostings
);
router.get(
  "/",
  verifySession({
    permissions: ["admin", "superadmin"],
  },
    true,
    true
  ),
  getAllJobpostings
);
router.get(
  "/scheduled",
  verifySession({
    permissions: ["admin", "superadmin"],
  },
    true,
    true
  ),
  getAllScheduledJobpostings
);
router.get(
  "/:id",
  verifySession({
    permissions: ["admin", "superadmin"],
  },
    true,
    true
  ),
  getJobpostingById
);
router.put(
  "/:id",
  verifySession({
    permissions: ["admin", "superadmin"],
  },
    true,
    true
  ),
  updateJobposting
);
router.delete(
  "/:id",
  verifySession({
    permissions: ["admin", "superadmin"],
  },
    true,
    true
  ),
  deleteJobposting
);

export default {
  metadata: {
    path: "/jobposting",
    method: ["POST", "GET"],
    description: "This route is used to add, update, delete, get all, get by id and search jobposting data",
    permissions: ["admin", "superadmin"],
  },
  router,
};
