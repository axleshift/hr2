import { Router } from "express";
const router = Router();

import dotenv from "dotenv";
dotenv.config();

import verifyApiKey from "../../middlewares/verifyApiKey";
import { createJobpostingRequest, updateJobpostingRequest, searchJobpostingRequests, getJobpostingRequestById } from "../..//database/v1/controllers/requestController";

router.post(
    "/jobposting", verifyApiKey, createJobpostingRequest
);

router.get(
    "/jobposting/search", verifyApiKey, searchJobpostingRequests
);

router.get(
    "/jobposting/:id", verifyApiKey, getJobpostingRequestById
);

router.put(
    "/jobposting/:id", verifyApiKey, updateJobpostingRequest
);

export default {
    metadata: {
        path: "/request",
        description: "This route is used to create, search, get and update jobposting requests",
    },
    router,
};