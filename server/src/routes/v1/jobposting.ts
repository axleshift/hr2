import { Router } from "express";
const router = Router();

import dotenv from "dotenv";
dotenv.config();

import { createJobposting, searchJobpostings, getAllJobpostings, getAllScheduledJobpostings, getJobpostingById, updateJobposting, deleteJobposting } from "../../database/v1/controllers/jobpostingController";

router.post("/", createJobposting);
router.get("/search", searchJobpostings);
router.get("/", getAllJobpostings);
router.get("/scheduled", getAllScheduledJobpostings);
router.get("/:id", getJobpostingById);
router.put("/:id", updateJobposting);
router.delete("/:id", deleteJobposting);

export default {
    metadata: {
        path: "/jobposting",
        method: ["POST", "GET"],
        description: "This route is used to add, update, delete, get all, get by id and search jobposting data",
        permissions: ["admin"],
    },
    router,
};
