import { Router } from "express";
const router = Router();
import {
  addNewResume,
  getAllResume,
  getResumeById,
  deleteResume,
  updateResume,
  searchResume,
} from "../database/controllers/applicantController";

router.post("/", addNewResume);
router.put("/:id", updateResume);
router.get("/all", getAllResume);
router.get("/search", searchResume);
router.get("/:id", getResumeById);
router.delete("/:id", deleteResume);

export default router;
