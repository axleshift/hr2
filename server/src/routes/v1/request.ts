import { Router } from "express";
const router = Router();

import dotenv from "dotenv";
dotenv.config();

import { externalgetAllJob, externalPostJob, getApplicantDocuments } from "../..//database/v1/controllers/requestController";

router.post(
	"/jobposting", externalPostJob
);

router.get(
	"/jobposting/all", externalgetAllJob
);

router.get(
	"/applicants/documents/:documentType", getApplicantDocuments
)

export default {
	metadata: {
		path: "/request",
		description: "This route is used to create, search, get and update jobposting requests",
	},
	router,
};