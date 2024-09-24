import { Router } from "express";
const router = Router();
import {
  addNewResume,
  getAllResume,
  getResumeById,
  deleteResume,
  updateResume,
} from "../database/controllers/applicantController";

router.post("/", addNewResume);
router.put("/:id", updateResume);
router.get("/all", getAllResume);
router.get("/:id", getResumeById);
router.delete("/:id", deleteResume);

export default router;
