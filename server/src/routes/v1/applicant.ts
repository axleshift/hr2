import { Router } from "express";
const router = Router();
import verifySession from "../../middlewares/verifySession";
import {
  addNewResume,
  updateResume,
  getAllResumeData,
  getApplicantByDocumentCategory,
  getResumeById,
  deleteResume,
  searchResume,
  getResumeFile,
} from "../../database/v1/controllers/applicantController";

router.post(
  "/",
  verifySession({
    permissions: ["applicant", "admin", "manager"],
  },
    true,
  ),
  addNewResume
);

router.put(
  "/:id",
  verifySession({
    permissions: ["applicant", "admin", "manager", "recruiter", "interviewer"],
  },
    true,
  ),
  updateResume
);

router.get(
  "/all",
  verifySession({
    permissions: ["admin", "manager", "recruiter"],
  },
    true,
  ),
  getAllResumeData
);

router.get(
  "/category/:category",
  verifySession({
    permissions: ["admin", "manager", "recruiter"],
  },
    true,
  ),
  getApplicantByDocumentCategory
);

router.get(
  "/download/:id",
  verifySession({
    permissions: ["admin", "manager", "recruiter", "interviewer"],
  },
    true,
  ),
  getResumeFile
);

router.get(
  "/search",
  verifySession({
    permissions: ["admin", "manager", "recruiter"],
  },
    true,
  ),
  searchResume
);

router.get(
  "/:id",
  verifySession({
    permissions: ["admin", "manager", "recruiter", "interviewer", "applicant"],
  },
    true,
  ),
  getResumeById
);

router.delete(
  "/:id",
  verifySession({
    permissions: ["admin", "manager"],
  },
    true,
  ),
  deleteResume
);

export default {
  metadata: {
    path: "/applicant",
    method: ["POST", "GET"],
    description: "This route is used to add, update, delete, get all, get by ID, search, and download resume data",
  },
  router,
};
