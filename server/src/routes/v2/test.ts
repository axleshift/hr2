import { Router } from "express";
const router = Router();

import dotenv from "dotenv";
dotenv.config();

import { createTest, getAllTests } from "../../database/v1/controllers/testController";

router.post("/", createTest);
router.get("/", getAllTests);

export default {
    metadata: {
        path: "/test",
        method: ["POST", "GET"],
        description: "Test route",
        permissions: ["admin"],
    },
    router,
};
