import { Router } from "express";
const router = Router();

import dotenv from "dotenv";
dotenv.config();

import { createJobpostingRequest, updateJobpostingRequest, searchJobpostingRequests, getJobpostingRequestById, getApplicantDocuments } from "../..//database/v1/controllers/requestController";

router.post(
	"/jobposting", createJobpostingRequest
);

router.get(
	"/jobposting/search", searchJobpostingRequests
);

router.get(
	"/jobposting/:id", getJobpostingRequestById
);

router.put(
	"/jobposting/:id", updateJobpostingRequest
);

router.get(
	"/applicants/document/:documentType", getApplicantDocuments
)

export default {
	metadata: {
		path: "/request",
		description: "This route is used to create, search, get and update jobposting requests",
	},
	router,
};