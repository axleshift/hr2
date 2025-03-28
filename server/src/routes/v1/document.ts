import { Router } from "express";
const router = Router();

import dotenv from "dotenv";
dotenv.config();

import verifySession from "../../middlewares/verifySession";
import { createDocument, updateDocument, getDocumentById, getDocumentByApplicantId, getDocumentByCategory, searchDocument } from "../../database/v1/controllers/documentController";

const allowedRoles = ["admin", "manager", "recruiter", "interviewer"];

router.post(
  "/create",
  verifySession(
    {
      permissions: allowedRoles,
    },
    true,
  ),
  createDocument
);

router.put(
  "/update/:id",
  verifySession(
    {
      permissions: allowedRoles,
    },
    true,
  ),
  updateDocument
);

router.get(
  "/:id",
  verifySession(
    {
      permissions: allowedRoles,
    },
    true,
  ),
  getDocumentById
);

router.get(
  "/applicant/:applicantId/:category",
  verifySession(
    {
      permissions: allowedRoles,
    },
    true,
  ),
  getDocumentByApplicantId
);

router.get(
  "/category/:category",
  verifySession(
    {
      permissions: allowedRoles,
    },
    true,
  ),
  getDocumentByCategory
);

router.get(
  "/search",
  verifySession(
    {
      permissions: allowedRoles,
    },
    true,
  ),
  searchDocument
);

export default {
  metadata: {
    path: "/document",
    description: "",
  },
  router,
};
