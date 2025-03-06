import { Router } from "express";
const router = Router();

import dotenv from "dotenv";
dotenv.config();
import verifySession from "../../middlewares/verifySession";

import { formSubmit } from "../../database/v1/controllers/googleFormController";

router.post(
  "/submit",
  verifySession({
    permissions: ["webhook", "admin"],
  }),
  formSubmit
);

export default {
  metadata: {
    path: "/googleform",
    description: "Google Form",
  },
  router,
};
