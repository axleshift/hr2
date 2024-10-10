import { Router } from "express";
const router = Router();
import { addNewResume, getAllResumeData, getResumeById, deleteResume, updateResume, searchResume, getResumeFile } from "../../database/controllers/applicantController";

router.post("/", addNewResume);
router.put("/:id", updateResume);
router.get("/all", getAllResumeData);
router.get("/download/:id", getResumeFile);
router.get("/search", searchResume);
router.get("/:id", getResumeById);
router.delete("/:id", deleteResume);

export default {
    metadata: {
        path: "/applicant",
        method: ["POST", "GET"],
        description: "This route is used to add, update, delete, get all, get by id, search and download resume data",
        permissions: ["admin"],
    },
    router,
};
