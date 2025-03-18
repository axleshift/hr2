import { Router } from "express";
const router = Router();

import dotenv from "dotenv";
dotenv.config();

import verifySession from "../../middlewares/verifySession";
import { createDocument, updateDocument, getDocumentById, getDocumentByApplicantId, getDocumentByCategory, searchDocument } from "../../database/v1/controllers/documentController";

// Create a new document
router.post(
  "/create",
  verifySession(
    {
      permissions: ["user", "admin"],
    },
    true,
    true
  ),
  createDocument
);

// Update an existing document
router.put(
  "/update/:id",
  verifySession(
    {
      permissions: ["user", "admin"],
    },
    true,
    true
  ),
  updateDocument
);

// Get a document by ID
router.get(
  "/:id",
  verifySession({
    permissions: ["user", "admin"],
  },
  true,
  true
),
  getDocumentById
);

// Get documents by applicant ID
router.get(
  "/applicant/:applicantId/:category",
  verifySession({
    permissions: ["user", "admin"],
  },
  true,
  true
),
  getDocumentByApplicantId
);

// Get documents by category
router.get(
  "/category/:category",
  verifySession({
    permissions: ["user", "admin"],
  },
  true,
  true
),
  getDocumentByCategory
);

// Search documents
router.get(
  "/search",
  verifySession({
    permissions: ["user", "admin"],
  },
  true,
  true
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
