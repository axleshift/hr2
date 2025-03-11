import { Router } from "express";
const router = Router();

import dotenv from "dotenv";
dotenv.config();
import { formSubmit } from "../../database/v1/controllers/googleFormController";

router.post(
  "/submit",
  formSubmit
);

export default {
  metadata: {
    path: "/googleform",
    description: "Google Form",
  },
  router,
};
