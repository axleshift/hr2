import { Router } from "express";
const router = Router();

import dotenv from "dotenv";
dotenv.config();
import verifySession from "../../middlewares/verifySession";

import { updateApikey } from "../../database/v1/controllers/apiKeyController";

router.get(
  "/update/:id",
  verifySession({
    permissions: ["user", "admin"],
  },
  true,
),
  updateApikey
);

export default {
  metadata: {
    path: "/api",
    description: "This route is used to add, update, delete, get all, get by id and search test data",
  },
  router,
};
