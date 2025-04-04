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

router.put(
  "/status/:applicantId/:stat",
  verifySession({
    permissions: ["applicant", "admin", "manager", "recruiter", "interviewer"],
  },
    true,
  ),
  updateStat
)

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

// Events
router.get(
  "/events/:applicantId",
  verifySession({
    permissions: ["admin", "manager", "recruiter", "interviewer", "applicant"],
  },
    true,
  ),
  getAllApplicantFacilityEvents
)

// Screening

router.post(
  "/screen/:applicantId",
  verifySession({
    permissions: ["admin", "manager", "recruiter", "interviewer", "applicant"],
  },
    true,
  ),
  createScreening
)

router.put(
  "/screen/:screeningId",
  verifySession({
    permissions: ["admin", "manager", "recruiter", "interviewer", "applicant"],
  },
    true,
  ),
  updateScreening
)

router.get(
  "/screen/ai/:applicantId/:jobId",
  verifySession({
    permissions: ["admin", "manager", "recruiter", "interviewer", "applicant"],
  },
    true,
  ),
  screenApplicantViaAI
)

router.get(
  "/screen/ai/:applicantId/:jobId/:screeningId",
  verifySession({
    permissions: ["admin", "manager", "recruiter", "interviewer", "applicant"],
  },
    true,
  ),
  screenApplicantViaAI
)

router.get(
  "/screen/all/:applicantId",
  verifySession({
    permissions: ["admin", "manager", "recruiter", "interviewer", "applicant"],
  },
    true,
  ),
  getAllScreening
)

// interview

router.post(
  "/interview/:applicantId/:eventId",
  verifySession({
    permissions: ["admin", "manager", "recruiter", "interviewer", "applicant"],
  },
    true,
  ),
  createInterview
)

router.put(
  "/interview/:interviewId",
  verifySession({
    permissions: ["admin", "manager", "recruiter", "interviewer", "applicant"],
  },
    true,
  ),
  updateInterview
)

router.get(
  "/interview/all/:applicantId",
  verifySession({
    permissions: ["admin", "manager", "recruiter", "interviewer", "applicant"],
  },
    true,
  ),
  getAllInterview
)

router.get(
  "/interview/recent",
  verifySession({
    permissions: ["admin", "manager", "recruiter", "interviewer"],
  },
    true,
  ),
  getAllRecentInterviews
)


router.get(
  "/interview/:interviewId",
  verifySession({
    permissions: ["admin", "manager", "recruiter", "interviewer"],
  },
    true,
  ),
  getAllInterview
)

// job offer
router.post(
  "/joboffer/:applicantId/",
  verifySession({
    permissions: ["admin", "manager", "recruiter"],
  },
    true,
  ),
  createJoboffer
)

router.post(
  "/joboffer/send-email/:jobofferId",
  verifySession({
    permissions: ["admin", "manager", "recruiter"],
  },
    true,
  ),
  sendJobOfferMail
)

router.put(
  "/joboffer/:jobofferId/",
  verifySession({
    permissions: ["admin", "manager", "recruiter"],
  },
    true,
  ),
  updateJoboffer
)

router.get(
  "/joboffer/all/:applicantId/",
  verifySession({
    permissions: ["admin", "manager", "recruiter"],
  },
    true,
  ),
  getAllJoboffer
)

router.get(
  "/joboffer/recent/",
  verifySession({
    permissions: ["admin", "manager", "recruiter"],
  },
    true,
  ),
  getAllRecentJoboffer
)

router.get(
  "/joboffer/:applicantId",
  verifySession({
    permissions: ["admin", "manager", "recruiter"],
  },
    true,
  ),
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
