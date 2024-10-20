import logger from "../../../middlewares/logger";
import Tag from "../models/tagModel";
import Applicant from "../models/applicantModel";
import { Request as req, Response as res } from "express";

export const createTag = async (req: req, res: res) => {
    const { name, category, description } = req.body;
    try {
        const tag = await Tag.create({
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
    } catch (error) {
        console.log(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error creating tag",
            error,
        });
    }
};

export const getAllTags = async (req: req, res: res) => {
    try {
        const page = typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
        const limit = typeof req.query.limit === "string" ? parseInt(req.query.limit) : 10;
        const skip = (page - 1) * limit;

        const totalTags = await Tag.find().countDocuments();
        const data = await Tag.find().sort({ createdAt: -1 }).skip(skip).limit(limit);

        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Tags retrieved successfully",
            data,
            total: totalTags,
            totalPages: Math.ceil(totalTags / limit),
            currentPage: page,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error retrieving tags",
            error,
        });
    }
};

export const searchTags = async (req: req, res: res) => {
    try {
        logger.info("Searching for tags");
        logger.info(req.query);
        const searchQuery = req.query.query;
        const page = typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
        const limit = typeof req.query.limit === "string" ? parseInt(req.query.limit) : 10;
        const skip = (page - 1) * limit;

        const totalTags = await Tag.find({
            $or: [{ name: { $regex: searchQuery, $options: "i" } }, { category: { $regex: searchQuery, $options: "i" } }, { description: { $regex: searchQuery, $options: "i" } }],
        }).countDocuments();

        const tags = await Tag.find({
            $or: [{ name: { $regex: searchQuery, $options: "i" } }, { category: { $regex: searchQuery, $options: "i" } }, { description: { $regex: searchQuery, $options: "i" } }],
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Tags retrieved successfully",
            data: tags,
            total: totalTags,
            totalPages: Math.ceil(totalTags / limit),
            currentPage: page,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error retrieving tags",
            error,
        });
    }
};

export const getTagById = async (req: req, res: res) => {
    const { id } = req.params;

    try {
        const tag = await Tag.findById(id);

        if (tag) {
            res.status(200).json({
                statusCode: 200,
                success: true,
                message: "Tag retrieved successfully",
                data: tag,
            });
        } else {
            res.status(404).json({
                statusCode: 404,
                success: false,
                message: "Tag not found",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error retrieving tag",
            error,
        });
    }
};

export const getTagByCategory = async (req: req, res: res) => {
    const { category } = req.params;

    try {
        const tags = await Tag.find({ category });

        if (tags.length > 0) {
            res.status(200).json({
                statusCode: 200,
                success: true,
                message: "Tags retrieved successfully",
                data: tags,
            });
        } else {
            res.status(404).json({
                statusCode: 404,
                success: false,
                message: "Tags not found",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error retrieving tags",
            error,
        });
    }
};

export const updateTag = async (req: req, res: res) => {
    const { id } = req.params;
    const { name, category, description, isProtected, isSystem } = req.body;

    try {
        const tag = await Tag.findById(id);

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
        } else {
            res.status(404).json({
                statusCode: 404,
                success: false,
                message: "Tag not found",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error updating tag",
            error,
        });
    }
};

export const deleteTag = async (req: req, res: res) => {
    const { id } = req.params;

    try {
        const tag = await Tag.findById(id);
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

        await Applicant.updateMany({ tags: tag._id }, { $pull: { tags: tag._id } });
        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Tag deleted successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error deleting tag",
            error,
        });
    }
};
