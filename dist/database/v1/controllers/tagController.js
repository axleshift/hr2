"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTag = exports.updateTag = exports.getTagByCategory = exports.getTagById = exports.searchTags = exports.getAllTags = exports.createTag = void 0;
const logger_1 = __importDefault(require("../../../middlewares/logger"));
const tagModel_1 = __importDefault(require("../models/tagModel"));
const applicantModel_1 = __importDefault(require("../models/applicantModel"));
const createTag = async (req, res) => {
    const { name, category, description } = req.body;
    try {
        const tag = await tagModel_1.default.create({
            name,
            category: category || "General",
            description: description || "No description provided",
        });
        res.status(201).json({
            statusCode: 201,
            success: true,
            message: "Tag created successfully",
            data: tag,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error creating tag",
            error,
        });
    }
};
exports.createTag = createTag;
const getAllTags = async (req, res) => {
    try {
        const page = typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
        const limit = typeof req.query.limit === "string" ? parseInt(req.query.limit) : 10;
        const skip = (page - 1) * limit;
        const totalTags = await tagModel_1.default.find().countDocuments();
        const data = await tagModel_1.default.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Tags retrieved successfully",
            data,
            total: totalTags,
            totalPages: Math.ceil(totalTags / limit),
            currentPage: page,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error retrieving tags",
            error,
        });
    }
};
exports.getAllTags = getAllTags;
const searchTags = async (req, res) => {
    try {
        logger_1.default.info("Searching for tags");
        const searchQuery = typeof req.query.query === "string" ? req.query.query.trim() : "";
        const page = typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
        const limit = typeof req.query.limit === "string" ? parseInt(req.query.limit) : 10;
        const skip = (page - 1) * limit;
        if (!searchQuery) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: "Search query is required",
            });
        }
        const totalTags = await tagModel_1.default.countDocuments({
            name: { $regex: searchQuery, $options: "i" },
        });
        const data = await tagModel_1.default.find({
            name: { $regex: searchQuery, $options: "i" },
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        if (data.length > 0) {
            return res.status(200).json({
                statusCode: 200,
                success: true,
                message: "Tags retrieved successfully",
                data,
                total: totalTags,
                totalPages: Math.ceil(totalTags / limit),
                currentPage: page,
            });
        }
        return res.status(404).json({
            statusCode: 404,
            success: false,
            message: "No tags found",
        });
    }
    catch (error) {
        logger_1.default.error("Error retrieving tags:", error);
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error retrieving tags",
            error,
        });
    }
};
exports.searchTags = searchTags;
const getTagById = async (req, res) => {
    const { id } = req.params;
    try {
        const tag = await tagModel_1.default.findById(id);
        if (tag) {
            res.status(200).json({
                statusCode: 200,
                success: true,
                message: "Tag retrieved successfully",
                data: tag,
            });
        }
        else {
            res.status(404).json({
                statusCode: 404,
                success: false,
                message: "Tag not found",
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error retrieving tag",
            error,
        });
    }
};
exports.getTagById = getTagById;
const getTagByCategory = async (req, res) => {
    const { category } = req.params;
    try {
        const tags = await tagModel_1.default.find({ category });
        if (tags.length > 0) {
            res.status(200).json({
                statusCode: 200,
                success: true,
                message: "Tags retrieved successfully",
                data: tags,
            });
        }
        else {
            res.status(404).json({
                statusCode: 404,
                success: false,
                message: "Tags not found",
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error retrieving tags",
            error,
        });
    }
};
exports.getTagByCategory = getTagByCategory;
const updateTag = async (req, res) => {
    const { id } = req.params;
    const { name, category, description, isProtected, isSystem } = req.body;
    try {
        const tag = await tagModel_1.default.findById(id);
        if (tag) {
            tag.name = name;
            tag.category = category;
            tag.description = description;
            tag.isProtected = isProtected;
            tag.isSystem = isSystem;
            await tag.save();
            res.status(200).json({
                statusCode: 200,
                success: true,
                message: "Tag updated successfully",
                data: tag,
            });
        }
        else {
            res.status(404).json({
                statusCode: 404,
                success: false,
                message: "Tag not found",
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error updating tag",
            error,
        });
    }
};
exports.updateTag = updateTag;
const deleteTag = async (req, res) => {
    const { id } = req.params;
    try {
        const tag = await tagModel_1.default.findById(id);
        if (!tag) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "Tag not found",
            });
        }
        if (tag.isProtected) {
            return res.status(403).json({
                statusCode: 403,
                success: false,
                message: "Cannot delete protected tag",
            });
        }
        if (tag.isSystem) {
            return res.status(403).json({
                statusCode: 403,
                success: false,
                message: "Cannot delete system tag",
            });
        }
        await tag.deleteOne();
        await applicantModel_1.default.updateMany({ tags: tag._id }, { $pull: { tags: tag._id } });
        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Tag deleted successfully",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error deleting tag",
            error,
        });
    }
};
exports.deleteTag = deleteTag;
