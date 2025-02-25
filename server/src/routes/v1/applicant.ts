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
    permissions: ["admin", "superadmin"],
  }),
  addNewResume
);
router.put(
  "/:id",
  verifySession({
    permissions: ["admin", "superadmin"],
  }),
  updateResume
);
router.get(
  "/all",
  verifySession({
    permissions: ["admin", "superadmin"],
  }),
  getAllResumeData
);

router.get(
  "/category/:category",
  verifySession({
    permissions: ["admin", "superadmin"],
  }),
  getApplicantByDocumentCategory
);

router.get(
  "/download/:id",
  verifySession({
    permissions: ["admin", "superadmin"],
  }),
  getResumeFile
);
router.get(
  "/search",
  verifySession({
    permissions: ["admin", "superadmin"],
  }),
  searchResume
);
router.get(
  "/:id",
  verifySession({
    permissions: ["admin", "superadmin"],
  }),
  getResumeById
);
router.delete(
  "/:id",
  verifySession({
    permissions: ["admin", "superadmin"],
  }),
  deleteResume
);

export default {
  metadata: {
    path: "/applicant",
    method: ["POST", "GET"],
    description: "This route is used to add, update, delete, get all, get by id, search and download resume data",
    permissions: ["admin", "superadmin"],
  },
  router,
};
