import { Router } from "express";
const router = Router();

import dotenv from "dotenv";
dotenv.config();

import { createTag, getAllTags, updateTag, getTagById, getTagByCategory, deleteTag, searchTags } from "../../database/v1/controllers/tagController";

router.post("/", createTag);
router.get("/all", getAllTags);
router.get("/search", searchTags);
router.get("/category/:category", getTagByCategory);
router.get("/:id", getTagById);
router.put("/:id", updateTag);
router.delete("/:id", deleteTag);

export default {
    metadata: {
        path: "/tags",
        method: ["POST", "GET", "PUT", "DELETE"],
        description: "This route is used to add, update, delete, get all, get by id and search tag data",
        permissions: ["admin", "user"],
    },
    router,
};
