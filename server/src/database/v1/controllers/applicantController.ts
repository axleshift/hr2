/**
 * @file applicantController.ts
 * @description Controller for handling applicant data
 */

import fs from "fs/promises";
import path from "path";
import { Request as req, Response as res } from "express";
import logger from "../../../middlewares/logger";
import Applicant, { IApplicant } from "../models/applicantModel";
import { config } from "../../../config";

export const addApplicant = async (req: req, res: res) => {
  try {
    if (req.body.tags) {
      req.body.tags = req.body.tags.split(",");
    }

    const data = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      middlename: req.body.middlename,
      suffix: req.body.suffix,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      preferredWorkLocation: req.body.preferredWorkLocation,
      linkedInProfile: req.body.linkedInProfile,
      portfolioLink: req.body.portfolioLink,
      yearsOfExperience: req.body.yearsOfExperience,
      currentMostRecentJob: req.body.currentMostRecentJob,
      highestQualification: req.body.highestQualification,
      majorFieldOfStudy: req.body.majorFieldOfStudy,
      institution: req.body.institution,
      graduationYear: req.body.graduationYear,
      keySkills: req.body.keySkills,
      softwareProficiency: req.body.softwareProficiency,
      certifications: req.body.certifications,
      coverLetter: req.body.coverLetter,
      salaryExpectation: req.body.salaryExpectation,
      availability: req.body.availability,
      jobAppliedFor: req.body.jobAppliedFor,
      whyInterestedInRole: req.body.whyInterestedInRole,
      tags: req.body.tags,
    };

    const newApplicant = await Applicant.create(data);

    return res.status(201).json({
      message: "Applicant created successfully",
      data: newApplicant,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      message: "An error occurred",
      error,
    });
  }
};

export const updateApplicant = async (req: req, res: res) => {
  try {
    const applicant = await Applicant.findById(req.params.id);
    if (!applicant) {
      return res.status(404).json({ message: "Applicant not found" });
    }

    // Handle tags, if provided
    if (req.body.tags && typeof req.body.tags === "string") {
      req.body.tags = req.body.tags.split(",").map((tag: string) => tag.trim());
    }

    const files = req.files as { [key: string]: Express.Multer.File[] } | undefined;
    
    // If no files are uploaded, respond with an error
    // if (!files) {
    //   return res.status(400).json({ message: "No files uploaded" });
    // }

    // Build file name map
    const fileNames: Record<string, string | undefined> = {
      resume: files?.resume?.[0]?.filename,
      medCert: files?.medCert?.[0]?.filename,
      birthCert: files?.birthCert?.[0]?.filename,
      NBIClearance: files?.NBIClearance?.[0]?.filename,
      policeClearance: files?.policeClearance?.[0]?.filename,
      TOR: files?.TOR?.[0]?.filename,
      idPhoto: files?.idPhoto?.[0]?.filename,
    };

    // Merge new files with existing files (overwrite only if new files uploaded)
    const mergedFiles = {
      ...applicant.files,
      ...Object.fromEntries(
        Object.entries(fileNames).filter(([_, val]) => val !== undefined)
      ),
    };

    // Prepare data for update
    const updateData = {
      ...req.body,
      files: mergedFiles,
    };

    // Perform update operation
    const updatedApplicant = await Applicant.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    return res.status(200).json({
      message: "Applicant updated successfully",
      data: updatedApplicant,
    });
  } catch (error) {
    logger.error(error)
    res.status(500).json({ message: "An error occurred", error });
  }
};


export const updateStat = async (req: req, res: res) => {
  try {
    const { applicantId, stat } = req.params;

    if (!applicantId || !stat) {
      return res.status(400).json({
        message: "Applicant ID and status field are required.",
      });
    }

    const applicant = await Applicant.findById(applicantId);
    if (!applicant) {
      return res.status(404).json({
        message: "Applicant not found.",
      });
    }

    // List of valid journey status fields
    const validJourneyStatuses: (keyof IApplicant["statuses"]["journey"])[] = [
      "isShortlisted",
      "isInitialInterview",
      "isTechnicalInterview",
      "isPanelInterview",
      "isBehavioralInterview",
      "isFinalInterview",
      "isJobOffer",
      "isHired",
    ];

    if (!validJourneyStatuses.includes(stat as keyof IApplicant["statuses"]["journey"])) {
      return res.status(400).json({
        message: `Invalid status field '${stat}'.`,
      });
    }

    const statusKey = stat as keyof IApplicant["statuses"]["journey"];
    const currentStatus = applicant.statuses.journey[statusKey];

    if (typeof currentStatus !== "boolean") {
      return res.status(400).json({
        message: `Status field '${stat}' is not a boolean.`,
      });
    }

    applicant.statuses.journey[statusKey] = !currentStatus;
    await applicant.save();

    return res.status(200).json({
      message: `Applicant status '${stat}' updated successfully.`,
      data: applicant,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while updating status.",
      error,
    });
  }
};

export const getAllApplicant = async (req: req, res: res) => {
  try {
    const page = typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
    const limit = typeof req.query.limit === "string" ? parseInt(req.query.limit) : 9;
    const skip = (page - 1) * limit;

    const applicants = await Applicant.find().sort({ createdAt: -1 }).skip(skip).limit(limit);

    const totalItems = await Applicant.countDocuments();
    const totalPages = Math.ceil(totalItems / limit);
    return res.status(200).json({
      message: "Applicants found",
      data: applicants,
      totalItems,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      message: "An error occurred",
      error,
    });
  }
};

export const getFile = async (req: req, res: res) => {
  try {
    // Find the applicant by ID
    const applicant = await Applicant.findById(req.params.id);
    if (!applicant) {
      return res.status(404).json({
        message: "Applicant not found",
      });
    }

    // Get the file field name from the request query
    const { fileField } = req.params;
    const fileName = applicant.files[fileField as keyof IApplicant['files']];

    if (!fileName) {
      return res.status(404).json({
        message: `${fileField} file not found`,
      });
    }

    // Construct the file path dynamically
    const filePath = `${config.fileServer.dir}/${fileField}/${fileName}`;
    logger.info(`Serving file: ${filePath}`);

    // Check if the file exists before attempting to download
    res.download(filePath, (err) => {
      if (err) {
        logger.error(err);
        return res.status(500).json({
          message: "Failed to download file",
        });
      }
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      message: "An error occurred",
      error,
    });
  }
};

export const searchApplicant = async (req: req, res: res) => {
  try {
    logger.info("Searching for resumes...");
    logger.info("Search Query:");
    logger.info(req.query.query);
    const searchQuery = req.query.query as string;
    const tags = req.query.tags ? (Array.isArray(req.query.tags) ? req.query.tags.map(String) : (req.query.tags as string).split(",")) : [];
    const page = typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
    const limit = typeof req.query.limit === "string" ? parseInt(req.query.limit) : 9;
    const skip = (page - 1) * limit;

    interface SearchCriteria {
      $or?: Array<{ [key: string]: { $regex: string; $options: string } } | { certifications: { $elemMatch: { $regex: string; $options: string } } } | { tags: { $in: string[] } }>;
      $and?: Array<SearchCriteria | { tags: { $in: string[] } }>;
      tags?: { $in: string[] };
    }

    let searchCriteria: SearchCriteria = {
      $or: [
        { firstname: { $regex: searchQuery, $options: "i" } },
        { lastname: { $regex: searchQuery, $options: "i" } },
        { email: { $regex: searchQuery, $options: "i" } },
        { phone: { $regex: searchQuery, $options: "i" } },
        { address: { $regex: searchQuery, $options: "i" } },
        { skills: { $regex: searchQuery, $options: "i" } },
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

    if (tags.length > 0) {
      if (searchQuery) {
        searchCriteria = {
          $and: [searchCriteria, { tags: { $in: tags } }],
        };
      } else {
        searchCriteria = { tags: { $in: tags } };
      }
    }

    const applicants = await Applicant.find(searchCriteria).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const totalItems = await Applicant.countDocuments(searchCriteria);
    if (!applicants || applicants.length === 0) {
      return res.status(404).json({
        message: "No applicants found",
      });
    }
    return res.status(200).json({
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
      message: "An error occurred",
      error,
    });
  }
};

export const getApplicantByDocumentCategory = async (req: req, res: res) => {
  try {
    const page = typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
    const limit = typeof req.query.limit === "string" ? parseInt(req.query.limit) : 9;
    const category = req.params.category as string;
    const skip = (page - 1) * limit;

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    // Define the filter mapping for categories
    const categoryFilters: Record<string, object> = {
      screening: { "statuses.journey.screening": true },
      shortlisted: { "statuses.journey.isShortlisted": true },
      interview: { "documentations.interview.completed": true },
      training: { "documentations.training.completed": true },
      others: { "documentations.others.completed": true },
    };

    // Check if the category is valid
    const filter = categoryFilters[category];
    if (!filter) {
      return res.status(400).json({ message: "Invalid document category" });
    }

    // Get applicants using the matching filter
    const applicants = await Applicant.find(filter).skip(skip).limit(limit);

    if (!applicants || applicants.length === 0) {
      return res.status(404).json({ message: "No applicants found" });
    }

    // Count only documents matching the category filter
    const totalItems = await Applicant.countDocuments(filter);

    return res.status(200).json({
      message: "Applicants found",
      data: applicants,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      message: "An error occurred",
      error,
    });
  }
};


export const getApplicantById = async (req: req, res: res) => {
  try {
    const applicant = await Applicant.findById(req.params.id);
    if (!applicant) {
      return res.status(404).json({
        message: "Applicant not found",
      });
    }
    return res.status(200).json({
      message: "Applicant found",
      data: applicant,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      message: "An error occurred",
      error,
    });
  }
};

export const deleteResume = async (req: req, res: res) => {
  try {
    const applicant = await Applicant.findById(req.params.id);
    if (!applicant) {
      return res.status(404).json({
        message: "Applicant not found",
      });
    }

    const filePath = path.join(config.fileServer.dir, applicant.files.resume || "");

    try {
      await fs.access(filePath); // Check if the file exists
      await fs.unlink(filePath); // Delete the file
    } catch (fileError) {
      logger.error("Error deleting file: ", fileError);
      return res.status(500).json({
        message: "Error deleting the file",
        error: fileError,
      });
    }

    await Applicant.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      message: "Applicant deleted successfully",
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      message: "An error occurred",
      error,
    });
  }
};
