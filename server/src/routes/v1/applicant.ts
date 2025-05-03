import { Request as req, Response as res, NextFunction as next, Router } from "express";
const router = Router();
import verifySession from "../../middlewares/verifySession";
import {
  addApplicant,
  updateApplicant,
  getAllApplicant,
  getApplicantByDocumentCategory,
  getApplicantById,
  deleteResume,
  searchApplicant,
  getFile,
  updateStat,
} from "../../database/v1/controllers/applicantController";

import { createScreening, getAllScreening, screenApplicantViaAI, updateScreening } from "../../database/v1/controllers/screeningController";
import { createInterview, getAllInterview, getAllRecentInterviews, updateInterview } from "../../database/v1/controllers/interviewController";
import { getAllApplicantFacilityEvents } from "../../database/v1/controllers/facilityController";
import { createJoboffer, getAllJoboffer, getAllRecentJoboffer, getJobofferById, sendJobOfferMail, updateJoboffer } from "../../database/v1/controllers/jobofferController";
import { upload } from "../../utils/fileUploadHandler";
import multer from "multer";

const uploader = upload('applicants')

router.post(
  "/",
  verifySession({
    permissions: ["applicant", "admin", "manager"],
  }),
  addApplicant
);

router.put(
  "/:id",
  verifySession({
    permissions: ["applicant", "admin", "manager", "recruiter", "interviewer"],
  }),
  uploader.fields([
    { name: "resume", maxCount: 1 },
    { name: "medCert", maxCount: 1 },
    { name: "birthCert", maxCount: 1 },
    { name: "NBIClearance", maxCount: 1 },
    { name: "policeClearance", maxCount: 1 },
    { name: "TOR", maxCount: 1 },
    { name: "idPhoto", maxCount: 1 },
  ]),
  (err: { message: any; }, req: req, res: res, next: next) => {
    if (err) {
      // Check for specific Multer errors
      if (err instanceof multer.MulterError) {
        // Handle Multer specific errors
        return res.status(400).send({ message: err.message });
      }
      // Handle general errors
      return res.status(500).send({ message: "Something went wrong!" });
    }
    next();
  },
  updateApplicant
);

router.put(
  "/status/:applicantId/:stat",
  verifySession({
    permissions: ["applicant", "admin", "manager", "recruiter", "interviewer"],
  }),
  updateStat
)

router.get(
  "/all",
  verifySession({
    permissions: ["admin", "manager", "recruiter"],
  }),
  getAllApplicant
);

router.get(
  "/category/:category",
  verifySession({
    permissions: ["admin", "manager", "recruiter"],
  }),
  getApplicantByDocumentCategory
);

// example: 
// GET /applicant/123456/file/resume
// GET /applicant/123456/file/medCert

router.get(
  "/applicant/:id/file/:fileField",
  verifySession({
    permissions: ["applicant", "admin", "manager", "recruiter", "interviewer"],
  }),
  getFile
);

router.get(
  "/search",
  verifySession({
    permissions: ["admin", "manager", "recruiter"],
  }),
  searchApplicant
);

router.get(
  "/:id",
  verifySession({
    permissions: ["admin", "manager", "recruiter", "interviewer", "applicant"],
  }),
  getApplicantById
);

router.delete(
  "/:id",
  verifySession({
    permissions: ["admin", "manager"],
  }),
  deleteResume
);

// Events
router.get(
  "/events/:applicantId",
  verifySession({
    permissions: ["admin", "manager", "recruiter", "interviewer", "applicant"],
  }),
  getAllApplicantFacilityEvents
)

// Screening

router.post(
  "/screen/:applicantId",
  verifySession({
    permissions: ["admin", "manager", "recruiter", "interviewer", "applicant"],
  }),
  createScreening
)

router.put(
  "/screen/:screeningId",
  verifySession({
    permissions: ["admin", "manager", "recruiter", "interviewer", "applicant"],
  }),
  updateScreening
)

router.get(
  "/screen/ai/:applicantId/:jobId",
  verifySession({
    permissions: ["admin", "manager", "recruiter", "interviewer", "applicant"],
  }),
  screenApplicantViaAI
)

router.get(
  "/screen/ai/:applicantId/:jobId/:screeningId",
  verifySession({
    permissions: ["admin", "manager", "recruiter", "interviewer", "applicant"],
  }),
  screenApplicantViaAI
)

router.get(
  "/screen/all/:applicantId",
  verifySession({
    permissions: ["admin", "manager", "recruiter", "interviewer", "applicant"],
  }),
  getAllScreening
)

// interview

router.post(
  "/interview/:applicantId/:eventId",
  verifySession({
    permissions: ["admin", "manager", "recruiter", "interviewer", "applicant"],
  }),
  createInterview
)

router.put(
  "/interview/:interviewId",
  verifySession({
    permissions: ["admin", "manager", "recruiter", "interviewer", "applicant"],
  }),
  updateInterview
)

router.get(
  "/interview/all/:applicantId",
  verifySession({
    permissions: ["admin", "manager", "recruiter", "interviewer", "applicant"],
  }),
  getAllInterview
)

router.get(
  "/interview/recent",
  verifySession({
    permissions: ["admin", "manager", "recruiter", "interviewer"],
  }),
  getAllRecentInterviews
)


router.get(
  "/interview/:interviewId",
  verifySession({
    permissions: ["admin", "manager", "recruiter", "interviewer"],
  }),
  getAllInterview
)

// job offer
router.post(
  "/joboffer/:applicantId/",
  verifySession({
    permissions: ["admin", "manager", "recruiter"],
  }),
  createJoboffer
)

router.post(
  "/joboffer/send-email/:jobofferId",
  verifySession({
    permissions: ["admin", "manager", "recruiter"],
  }),
  sendJobOfferMail
)

router.put(
  "/joboffer/:jobofferId/",
  verifySession({
    permissions: ["admin", "manager", "recruiter"],
  }),
  updateJoboffer
)

router.get(
  "/joboffer/all/:applicantId/",
  verifySession({
    permissions: ["admin", "manager", "recruiter"],
  }),
  getAllJoboffer
)

router.get(
  "/joboffer/recent/",
  verifySession({
    permissions: ["admin", "manager", "recruiter"],
  }),
  getAllRecentJoboffer
)

router.get(
  "/joboffer/:applicantId",
  verifySession({
    permissions: ["admin", "manager", "recruiter"],
  }),
  getJobofferById
)

export default {
  metadata: {
    path: "/applicant",
    method: ["POST", "GET"],
    description: "This route is used to add, update, delete, get all, get by ID, search, and download resume data",
  },
  router,
};
