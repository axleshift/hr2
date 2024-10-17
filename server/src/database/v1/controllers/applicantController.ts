import fs from "fs/promises";
import path from "path";
import { Request, Response } from "express";
import logger from "../../../middlewares/logger";
import { upload } from "../../../utils/fileUploadHandler";

import Applicant from "../models/applicantModel";
import { config } from "../../../config";

import { ApplicantData, ApplicantDocument } from "../../../types/application";

export const handleFileUpload = (req: Request, res: Response) => {
    return new Promise((resolve, reject) => {
        upload("applicants").single("file")(req, res, (err) => {
            if (err) {
                reject(err);
            }
            resolve(req.file);
        });
    });
};

export const addNewResume = async (req: Request, res: Response) => {
    try {
        const file = (await handleFileUpload(req, res)) as Express.Multer.File;
        if (!file) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: "Please upload a file",
                error: "No file uploaded",
            });
        }

        const childDir = "applicants";
        const filePath = `/${childDir}/${file.filename}`;

        const data = {
            firstname: req.body.firstname,
            middlename: req.body.middlename,
            lastname: req.body.lastname,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
            portfolioURL: req.body.portfolioURL,
            professionalSummary: req.body.professionalSummary,
            skills: req.body.skills,
            workExperience: req.body.workExperience,
            education: req.body.education,
            certifications: JSON.parse(req.body.certifications),
            tags: JSON.parse(req.body.tags),
            remarks: req.body.remarks,
            resumeFileLoc: filePath,
        };

        const newApplicant: ApplicantData = await Applicant.create(data);
        return res.status(201).json({
            statusCode: 201,
            success: true,
            message: "Applicant created successfully",
            data: newApplicant,
        });
    } catch (error) {
        logger.error(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "An error occurred",
            error,
        });
    }
};

export const updateResume = async (req: Request, res: Response) => {
    try {
        const file = (await handleFileUpload(req, res)) as Express.Multer.File;

        const data: Partial<ApplicantData> = {};

        const fieldsToUpdate = ["firstname", "middlename", "lastname", "email", "phone", "address", "portfolioURL", "professionalSummary", "skills", "workExperience", "education", "certifications", "tags", "remarks"];

        fieldsToUpdate.forEach((field) => {
            if (req.body[field]) {
                data[field as keyof ApplicantData] = field === "certifications" || field === "tags" ? JSON.parse(req.body[field]) : req.body[field];
            }
        });

        if (file) {
            const applicant = (await Applicant.findById(req.params.id).exec()) as ApplicantDocument | null;
            const childDir = "applicants";
            if (!applicant) {
                return res.status(404).json({
                    statusCode: 404,
                    success: false,
                    message: "Applicant not found",
                });
            }

            const filePath = `/${childDir}/${applicant.resumeFileLoc}`;
            try {
                await fs.unlink(filePath);
            } catch (error) {
                logger.error("Error deleting file: ", error);
            }

            data.resumeFileLoc = `/${childDir}/${file.filename}`;
        }

        const updatedApplicant = await Applicant.findByIdAndUpdate(req.params.id, data, {
            new: true,
        });

        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Applicant updated successfully",
            data: updatedApplicant,
        });
    } catch (error) {
        logger.error(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "An error occurred",
            error,
        });
    }
};

export const getAllResumeData = async (req: Request, res: Response) => {
    try {
        const page = typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
        const limit = typeof req.query.limit === "string" ? parseInt(req.query.limit) : 9;
        const skip = (page - 1) * limit;

        const applicants = await Applicant.find().sort({ createdAt: -1 }).skip(skip).limit(limit);

        const totalItems = await Applicant.countDocuments();
        const totalPages = Math.ceil(totalItems / limit);
        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Applicants found",
            data: applicants,
            totalItems,
            totalPages,
            currentPage: page,
        });
    } catch (error) {
        logger.error(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "An error occurred",
            error,
        });
    }
};

export const getResumeFile = async (req: Request, res: Response) => {
    try {
        // Find the applicant by ID
        const applicant = await Applicant.findById(req.params.id);
        if (!applicant) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "Applicant not found",
            });
        }

        // Construct the file path
        const filePath = `${config.fileServer.dir}/${applicant.resumeFileLoc}`;
        logger.info(`Downloading file: ${filePath}`);

        // Check if file exists before attempting to download
        res.download(filePath, (err) => {
            if (err) {
                logger.error(err);
                return res.status(500).json({
                    statusCode: 500,
                    success: false,
                    message: "Failed to download file",
                });
            }
        });
    } catch (error) {
        logger.error(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "An error occurred",
            error,
        });
    }
};

export const searchResume = async (req: Request, res: Response) => {
    try {
        logger.info("Searching for resumes...");
        logger.info("Search Query:", req.query);
        const searchQuery = req.query.query as string;
        const tags = req.query.tags ? (Array.isArray(req.query.tags) ? req.query.tags.map(String) : (req.query.tags as string).split(",")) : [];

        // let tags: string[] = [];
        // // Check if tags exist in the query
        // if (req.query.tags) {
        //     // If tags is already an array
        //     if (Array.isArray(req.query.tags)) {
        //         tags = req.query.tags.map(String); // Convert all elements to strings
        //     } else {
        //         // If tags is a string, split by commas to form an array
        //         tags = (req.query.tags as string).split(",");
        //     }
        // }
        const page = typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
        const limit = typeof req.query.limit === "string" ? parseInt(req.query.limit) : 9;
        const skip = (page - 1) * limit;

        interface SearchCriteria {
            $or: Array<{ [key: string]: { $regex: string; $options: string } } | { certifications: { $elemMatch: { $regex: string; $options: string } } } | { tags: { $in: string[] } }>;
        }

        const searchCriteria: SearchCriteria = {
            $or: [
                { firstname: { $regex: searchQuery, $options: "i" } },
                { lastname: { $regex: searchQuery, $options: "i" } },
                { email: { $regex: searchQuery, $options: "i" } },
                { phone: { $regex: searchQuery, $options: "i" } },
                { address: { $regex: searchQuery, $options: "i" } },
                { skills: { $regex: searchQuery, $options: "i" } },
                { workExperience: { $regex: searchQuery, $options: "i" } },
                { education: { $regex: searchQuery, $options: "i" } },
                { remarks: { $regex: searchQuery, $options: "i" } },
                // array fields
                {
                    certifications: {
                        $elemMatch: {
                            $regex: searchQuery,
                            $options: "i",
                        },
                    },
                },
            ],
        };

        // Add tags condition if tags array is not empty
        if (tags.length > 0) {
            searchCriteria.$or.push({
                tags: { $in: tags },
            });
        }

        const applicants = await Applicant.find(searchCriteria).sort({ createdAt: -1 }).skip(skip).limit(limit);
        const totalItems = await Applicant.countDocuments(searchCriteria);
        // const totalPages = Math.ceil(totalItems / limit);
        if (!applicants || applicants.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "No applicants found",
            });
        }
        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Applicants found",
            data: applicants,
            totalItems,
            totalPages: Math.ceil(totalItems / limit),
            tags: tags,
            currentPage: page,
        });
    } catch (error) {
        logger.error(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "An error occurred",
            error,
        });
    }
};
export const getResumeById = async (req: Request, res: Response) => {
    try {
        const applicant = await Applicant.findById(req.params.id);
        if (!applicant) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "Applicant not found",
            });
        }
        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Applicant found",
            data: applicant,
        });
    } catch (error) {
        logger.error(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "An error occurred",
            error,
        });
    }
};

export const deleteResume = async (req: Request, res: Response) => {
    try {
        const applicant = await Applicant.findById(req.params.id);
        if (!applicant) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "Applicant not found",
            });
        }

        const filePath = path.join(config.fileServer.dir, applicant.resumeFileLoc);

        try {
            await fs.access(filePath); // Check if the file exists
            await fs.unlink(filePath); // Delete the file
        } catch (fileError) {
            logger.error("Error deleting file: ", fileError);
            return res.status(500).json({
                statusCode: 500,
                success: false,
                message: "Error deleting the file",
                error: fileError,
            });
        }

        await Applicant.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Applicant deleted successfully",
        });
    } catch (error) {
        logger.error(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "An error occurred",
            error,
        });
    }
};
