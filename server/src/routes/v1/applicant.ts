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
    permissions: ["user", "admin"],
  },
  true,
  true
),
  addNewResume
);
router.put(
  "/:id",
  verifySession({
    permissions: ["user", "admin"],
  },
  true,
  true
),
  updateResume
);
router.get(
  "/all",
  verifySession({
    permissions: ["user", "admin"],
  },
  true,
  true
),
  getAllResumeData
);

router.get(
  "/category/:category",
  verifySession({
    permissions: ["user", "admin"],
  },
  true,
  true
),
  getApplicantByDocumentCategory
);

router.get(
  "/download/:id",
  verifySession({
    permissions: ["user", "admin"],
  },
  true,
  true
),
  getResumeFile
);
router.get(
  "/search",
  verifySession({
    permissions: ["user", "admin"],
  },
  true,
  true
),
  searchResume
);
router.get(
  "/:id",
  verifySession({
    permissions: ["user", "admin"],
  },
  true,
  true
),
  getResumeById
);
router.delete(
  "/:id",
  verifySession({
    permissions: ["user", "admin"],
  },
  true,
  true
),
  deleteResume
);

export default {
  metadata: {
    path: "/applicant",
    method: ["POST", "GET"],
    description: "This route is used to add, update, delete, get all, get by id, search and download resume data",
    permissions: ["user", "admin"],
  },
  router,
};
