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
  updateStat,
} from "../../database/v1/controllers/applicantController";

import { createScreening, getAllScreening, screenApplicantViaAI, updateScreening } from "../../database/v1/controllers/screeningController";
import { createInterview, getAllInterview, getAllRecentInterviews, updateInterview } from "../../database/v1/controllers/interviewController";
import { getAllApplicantFacilityEvents } from "../../database/v1/controllers/facilityController";
import { createJoboffer, getAllJoboffer, getAllRecentJoboffer, getJobofferById, sendJobOfferMail, updateJoboffer } from "../../database/v1/controllers/jobofferController";

router.post(
  "/",
  verifySession({
    permissions: ["applicant", "admin", "manager"],
  }),
  addNewResume
);

router.put(
  "/:id",
  verifySession({
    permissions: ["applicant", "admin", "manager", "recruiter", "interviewer"],
  }),
  updateResume
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
  getAllResumeData
);

router.get(
  "/category/:category",
  verifySession({
    permissions: ["admin", "manager", "recruiter"],
  }),
  getApplicantByDocumentCategory
);

router.get(
  "/download/:id",
  verifySession({
    permissions: ["admin", "manager", "recruiter", "interviewer"],
  }),
  getResumeFile
);

router.get(
  "/search",
  verifySession({
    permissions: ["admin", "manager", "recruiter"],
  }),
  searchResume
);

router.get(
  "/:id",
  verifySession({
    permissions: ["admin", "manager", "recruiter", "interviewer", "applicant"],
  }),
  getResumeById
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
