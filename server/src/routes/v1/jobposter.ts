import { Router } from "express";
const router = Router();

import dotenv from "dotenv";
dotenv.config();
import verifySession from "../../middlewares/verifySession";

import { createJobposter, getJobposterByRefId, getAllJobposters, removeJobposter } from "../../database/v1/controllers/jobposterController";

router.post("/:id/post",
  verifySession({
    permissions: ["admin", "manager", "recruiter"],
  }),
  createJobposter);

router.get("/all",
  verifySession({
    permissions: ["admin", "manager", "recruiter"],
  }),
  getAllJobposters);

router.get("/:id",
  verifySession({
    permissions: ["admin", "manager", "recruiter"],
  }),
  getJobposterByRefId);
  
router.delete("/:id",
  verifySession({
    permissions: ["admin", "manager", "recruiter"],
  }),
  removeJobposter);

export default {
  metadata: {
    path: "/jobposter",
    description: "This route is used to add, get by ref id and remove jobposter data",
  },
  router,
};
