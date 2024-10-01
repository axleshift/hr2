import fs from "fs/promises";
import multer from "multer";
import { Request, Response } from "express";
import logger from "../../middleware/logger";
import { upload } from "../../utils/fileUploadHandler";

import Applicant from "../models/applicantModel";
import { config } from "../../config";
import { error } from "console";

interface Certification {
  name: string;
  year: string;
}
interface ApplicantData {
  firstname?: string;
  middlename?: string | null;
  lastname?: string;
  email?: string;
  phone?: string;
  address?: string;
  portfolioURL?: string | null;
  professionalSummary?: string;
  skills?: string;
  workExperience?: string;
  education?: string;
  certifications?: Certification[];
  tags?: string[];
  remarks?: string | null;
  resumeFileLoc?: string;
}

interface ApplicantDocument extends ApplicantData {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

const addNewResume = (req: Request, res: Response) => {
  // Use multer's upload.single method inside the controller
  // I'm seriously not sure why this is done this way, but I'm guessing it's to make the code more modular? idk
  try {
    upload.single("file")(req, res, async (err) => {
      if (error instanceof multer.MulterError) {
        return res.status(500).json({
          statusCode: 500,
          success: false,
          message: "Error processing file",
          error: err,
        });
      } else if (err) {
        return res.status(500).json({
          statusCode: 500,
          success: false,
          message: "An error occurred",
          error: err,
        });
      }

      const file = req.file;
      logger.info("File uploaded: ", file);

      if (!file) {
        return res.status(400).json({
          statusCode: 400,
          success: false,
          message: "Please upload a file",
          error: "No file uploaded",
        });
      }

      console.log(`Request body` + JSON.stringify(req.body));

      const filepath = `${config.exposeDir}/uploads/${file.filename}`;

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
        resumeFileLoc: filepath,
      };

      const newApplicant: ApplicantData = await Applicant.create(data);
      return res.status(201).json({
        statusCode: 201,
        success: true,
        message: "Applicant created successfully",
        data: newApplicant,
      });
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

interface UpdateData {
  [key: string]: string | string[] | undefined;
  resumeFileLoc?: string;
}

const updateResume = async (req: Request, res: Response) => {
  try {
    upload.single("file")(req, res, async (err) => {
      if (error instanceof multer.MulterError) {
        return res.status(500).json({
          statusCode: 500,
          success: false,
          message: "Error processing file",
          error: err,
        });
      } else if (err) {
        return res.status(500).json({
          statusCode: 500,
          success: false,
          message: "An error occurred",
          error: err,
        });
      }

      const file = req.file;

      // Create an empty object to hold the fields to be updated
      // I was stupid at not doing this in the previous controller
      // I was high in caffeine and sugar, so I'm sorry

      const data: UpdateData = {};

      // Only update fields that exist in the request body
      const fieldsToUpdate = [
        "firstname",
        "middlename",
        "lastname",
        "email",
        "phone",
        "address",
        "portfolioURL",
        "professionalSummary",
        "skills",
        "workExperience",
        "education",
        "certifications",
        "tags",
        "remarks",
      ];

      fieldsToUpdate.forEach((field) => {
        if (req.body[field]) {
          data[field] =
            field === "certifications" || field === "tags"
              ? JSON.parse(req.body[field])
              : req.body[field];
        }
      });

      // If a file is uploaded, update resumeFileLoc and delete the old file
      if (file) {
        const applicant = (await Applicant.findById(
          req.params.id
        ).exec()) as ApplicantDocument | null;
        const filePath = `${config.resumes.fsDir}/${applicant?.resumeFileLoc}`;
        if (!applicant) {
          return res.status(404).json({
            statusCode: 404,
            success: false,
            message: "Applicant not found",
          });
        }

        try {
          await fs.unlink(filePath);
        } catch (error) {
          logger.error(error);
          return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Cannot delete old resume file",
            error,
          });
        }

        data.resumeFileLoc = file.filename;
      }

      // Update the applicant in the database with only the provided fields
      const updatedApplicant = await Applicant.findByIdAndUpdate(
        req.params.id,
        data,
        {
          new: true,
        }
      );

      return res.status(200).json({
        statusCode: 200,
        success: true,
        message: "Applicant updated successfully",
        data: updatedApplicant,
      });
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

const getAllResume = async (req: Request, res: Response) => {
  try {
    const page =
      typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
    const limit =
      typeof req.query.limit === "string" ? parseInt(req.query.limit) : 9;
    const skip = (page - 1) * limit;

    const applicants = await Applicant.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

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

const searchResume = async (req: Request, res: Response) => {
  try {
    const searchQuery = req.query.query;
    // const tags = req.query.tags;
    const page =
      typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
    const limit =
      typeof req.query.limit === "string" ? parseInt(req.query.limit) : 9;
    const skip = (page - 1) * limit;

    const totalItems = await Applicant.countDocuments({
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
        {
          tags: {
            $elemMatch: {
              $regex: searchQuery,
              $options: "i",
            },
          },
        },
      ],
    });

    const data = await Applicant.find({
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
        {
          tags: {
            $elemMatch: {
              $regex: searchQuery,
              $options: "i",
            },
          },
        },
      ],
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalItems / limit);
    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Applicants found",
      data,
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

const getResumeById = async (req: Request, res: Response) => {
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

const deleteResume = async (req: Request, res: Response) => {
  try {
    const applicant = await Applicant.findById(req.params.id);
    if (!applicant) {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        message: "Applicant not found",
      });
    }

    const filePath = `${config.resumes.fsDir}/${applicant.resumeFileLoc}`;
    await fs.unlink(filePath);

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

export {
  addNewResume,
  getAllResume,
  getResumeById,
  deleteResume,
  updateResume,
  searchResume,
};
