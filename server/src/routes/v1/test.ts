import { Router } from "express";
const router = Router();

import dotenv from "dotenv";
dotenv.config();

router.get("/", (req, res) => {
	res.json({
		message: "Hello, World!",
	});
});

export default {
	metadata: {
		path: "/test",
		description: "Test route",
	},
	router,
};
