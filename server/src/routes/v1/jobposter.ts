import { Router } from "express";
const router = Router();

import dotenv from "dotenv";
dotenv.config();

import { createJobposter, getJobposterByRefId, getAllJobposters, removeJobposter } from "../../database/v1/controllers/jobposterController";

router.post("/:id/post", createJobposter);
router.get("/all", getAllJobposters);
router.get("/:id", getJobposterByRefId);
router.delete("/:id", removeJobposter);

export default {
    metadata: {
        path: "/jobposter",
        method: ["POST", "GET"],
        description: "This route is used to add, get by ref id and remove jobposter data",
        permissions: ["admin"],
    },
    router,
};
