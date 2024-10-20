"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const tagController_1 = require("../../database/v1/controllers/tagController");
router.post("/", tagController_1.createTag);
router.get("/all", tagController_1.getAllTags);
router.get("/:id", tagController_1.getTagById);
router.get("/search", tagController_1.searchTags);
router.get("/category/:category", tagController_1.getTagByCategory);
router.put("/:id", tagController_1.updateTag);
router.delete("/:id", tagController_1.deleteTag);
exports.default = {
    metadata: {
        path: "/tags",
        method: ["POST", "GET"],
        description: "This route is used to add, update, delete, get all, get by id and search tag data",
        permissions: ["admin", "user"],
    },
    router,
};
