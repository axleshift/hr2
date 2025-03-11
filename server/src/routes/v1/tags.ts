import { Router } from "express";
const router = Router();

import dotenv from "dotenv";
dotenv.config();
import verifySession from "../../middlewares/verifySession";

import { createTag, getAllTags, updateTag, getTagById, getTagByCategory, deleteTag, searchTags } from "../../database/v1/controllers/tagController";

router.post(
  "/",
  verifySession({
    permissions: ["admin", "superadmin"],
  },
    true,
    true
  ),
  createTag
);
router.get(
  "/all",
  verifySession({
    permissions: ["admin", "superadmin"],
  },
    true,
    true
  ),
  getAllTags
);
router.get(
  "/search",
  verifySession({
    permissions: ["admin", "superadmin"],
  },
    true,
    true
  ),
  searchTags
);
router.get(
  "/category/:category",
  verifySession({
    permissions: ["admin", "superadmin"],
  },
    true,
    true
  ),
  getTagByCategory
);
router.get(
  "/:id",
  verifySession({
    permissions: ["admin", "superadmin"],
  },
    true,
    true
  ),
  getTagById
);
router.put(
  "/:id",
  verifySession({
    permissions: ["admin", "superadmin"],
  },
    true,
    true
  ),
  updateTag
);
router.delete(
  "/:id",
  verifySession({
    permissions: ["admin", "superadmin"],
  },
    true,
    true
  ),
  deleteTag
);

export default {
  metadata: {
    path: "/tags",
    description: "This route is used to add, update, delete, get all, get by id and search tag data",
  },
  router,
};
