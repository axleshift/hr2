"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const verifySession_1 = __importDefault(require("../../middlewares/verifySession"));
const tagController_1 = require("../../database/v1/controllers/tagController");
router.post("/", (0, verifySession_1.default)({
    permissions: ["admin", "superadmin"],
}), tagController_1.createTag);
router.get("/all", (0, verifySession_1.default)({
    permissions: ["admin", "superadmin"],
}), tagController_1.getAllTags);
router.get("/search", (0, verifySession_1.default)({
    permissions: ["admin", "superadmin"],
}), tagController_1.searchTags);
router.get("/category/:category", (0, verifySession_1.default)({
    permissions: ["admin", "superadmin"],
}), tagController_1.getTagByCategory);
router.get("/:id", (0, verifySession_1.default)({
    permissions: ["admin", "superadmin"],
}), tagController_1.getTagById);
router.put("/:id", (0, verifySession_1.default)({
    permissions: ["admin", "superadmin"],
}), tagController_1.updateTag);
router.delete("/:id", (0, verifySession_1.default)({
    permissions: ["admin", "superadmin"],
}), tagController_1.deleteTag);
exports.default = {
    metadata: {
        path: "/tags",
        description: "This route is used to add, update, delete, get all, get by id and search tag data",
    },
    router,
};
