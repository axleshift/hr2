import { Router } from "express";
const router = Router();

import dotenv from "dotenv";
dotenv.config();
import verifySession from "../../middlewares/verifySession";

import { createJobposting, searchJobpostings, getAllJobpostings, getAllScheduledJobpostings, getJobpostingById, updateJobposting, deleteJobposting } from "../../database/v1/controllers/jobpostingController";

router.post(
  "/",
  verifySession({
    permissions: ["admin", "manager", "recruiter"],
  }),
  createJobposting
);

router.get(
  "/search",
  verifySession({
    permissions: ["admin", "manager", "recruiter"],
  }),
  searchJobpostings
);
router.get(
  "/",
  verifySession({
    permissions: ["admin", "manager", "recruiter"],
  }),
  getAllJobpostings
);
router.get(
  "/scheduled",
  verifySession({
    permissions: ["admin", "manager", "recruiter"],
  }),
  getAllScheduledJobpostings
);
router.get(
  "/:id",
  verifySession({
    permissions: ["admin", "manager", "recruiter"],
  }),
  getJobpostingById
);
router.put(
  "/:id",
  verifySession({
    permissions: ["admin", "manager", "recruiter"],
  }),
  updateJobposting
);
router.delete(
  "/:id",
  verifySession({
    permissions: ["user", "admin"],
  }),
  deleteJobposting
);

export default {
  metadata: {
    path: "/jobposting",
    method: ["POST", "GET"],
    description: "This route is used to add, update, delete, get all, get by id and search jobposting data",
    permissions: ["user", "admin"],
  },
  router,
};
