import { Router } from "express";
const router = Router();

import dotenv from "dotenv";
dotenv.config();

import { createTag, getAllTags, updateTag, getTagById, getTagByCategory, deleteTag, searchTags } from "../database/controllers/tagController";

router.post("/", createTag);
router.get("/all", getAllTags);
router.get("/:id", getTagById);
router.get("/search", searchTags);
router.get("/category/:category", getTagByCategory);
router.put("/:id", updateTag);
router.delete("/:id", deleteTag);

export default router;
