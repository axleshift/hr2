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
import { sendEmail } from "../../../utils/mailHandler";

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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

export const rejectApplicant = async (req: req, res: res) => {
  try {
    const applicantId = req.params.id;

    const applicant = await Applicant.findById(applicantId);
    if (!applicant) {
      return res.status(404).json({
        message: "Applicant not found",
      });
    }

    const isCurrentlyRejected = applicant.status.toLowerCase() === 'Rejected';
    const newStatus = isCurrentlyRejected ? 'Active' : 'Rejected';

    applicant.status = newStatus;
    await applicant.save();

    if (newStatus === 'Rejected') {
      const fullName = `${applicant.firstname} ${applicant.lastname}`;
      const templatePath = path.join(__dirname, '../../../public/templates/rejectionEmail.html');
      const emailTemplate = await fs.readFile(templatePath, 'utf-8');

      const emailText = emailTemplate
        .replace(/{{fullName}}/g, fullName)
        .replace(/{{jobTitle}}/g, applicant.jobAppliedFor);

      const emailResult = await sendEmail(
        'Application Update',
        applicant.email,
        'Your Application with AxleShift',
        '',
        emailText
      );

      if (!emailResult.success) {
        return res.status(500).json({
          message: `Applicant rejected, but email failed to send to ${applicant.email}`,
          error: emailResult.message,
          data: applicant
        });
      }

      return res.status(200).json({
        message: "Applicant rejected and email sent successfully",
        data: applicant,
      });

    } else {
      return res.status(200).json({
        message: "Applicant status reverted to Active",
        data: applicant,
      });
    }

  } catch (error) {
    logger.error(error);
    res.status(500).json({
      message: "An error occurred",
      error,
    });
  }
};


export const getAllApplicant = async (req: req, res: res) => {
  try {
    const page = typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
    const limit = typeof req.query.limit === "string" ? parseInt(req.query.limit) : 9;
    const skip = (page - 1) * limit;
    const showRejected = req.query.showRejected === "true";

    const filter = showRejected
      ? { status: { $in: ["Active", "Rejected"] } }
      : { status: "Active" };

    const applicants = await Applicant.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalItems = await Applicant.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / limit);

    return res.status(200).json({
      message: "Applicants found",
      data: applicants,
      totalItems,
      totalPages,
      currentPage: page,
      showRejected,
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
      interview: { "statuses.journey.completed": true },
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

export const getEligibleForJobOffer = async (req: req, res: res) => {
  try {
    const page = typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
    const limit = typeof req.query.limit === "string" ? parseInt(req.query.limit) : 10;
    const skip = (page - 1) * limit;

    const filter = {
      "statuses.journey.isFinalInterview": true,
      "statuses.journey.isJobOffer": false,
    };

    const applicants = await Applicant.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ updatedAt: -1 });

    const totalItems = await Applicant.countDocuments(filter);

    return res.status(200).json({
      message: "Eligible applicants found",
      data: applicants,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      message: "An error occurred",
      error,
    });
  }
}

export const deleteApplicant = async (req: req, res: res) => {
  try {
    const applicant = await Applicant.findById(req.params.id);

    if (!applicant) {
      return res.status(404).json({ message: "Applicant not found" });
    }

    // Delete all files in the applicant.files object
    if (applicant.files) {
      for (const [key, filePathValue] of Object.entries(applicant.files)) {
        if (filePathValue) {
          const filePath = path.join(config.fileServer.dir, filePathValue);
          try {
            await fs.access(filePath);
            await fs.unlink(filePath);
            logger.info(`Deleted file: ${filePath}`);
          } catch (err) {
            logger.warn(`Failed to delete ${key}: ${err}`);
          }
        }
      }
    }

    // Overwrite PII fields with dummy or null values
    applicant.firstname = "Deleted";
    applicant.lastname = "User";
    applicant.middlename = undefined;
    applicant.suffix = undefined;
    applicant.email = "deleted@example.com";
    applicant.phone = undefined;
    applicant.address = undefined;
    applicant.linkedInProfile = undefined;
    applicant.portfolioLink = undefined;

    applicant.coverLetter = undefined;
    applicant.whyInterestedInRole = undefined;
    applicant.ids = {};
    applicant.files = {};

    // Save the obfuscated reccord
    await applicant.save();

    return res.status(200).json({
      message: "Applicant data anonymized successfully",
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      message: "An error occurred",
      error,
    });
  }
};

const validFileFields = [
  'resume', 'medCert', 'birthCert',
  'NBIClearance', 'policeClearance', 'TOR', 'idPhoto',
] as const;

const validInterviewFields = [
  'InitialInterview', 'TechnicalInterview',
  'PanelInterview', 'BehavioralInterview', 'FinalInterview',
] as const;

type FileField = typeof validFileFields[number];
type InterviewField = typeof validInterviewFields[number];

export const getFile = async (req: req, res: res) => {
  try {
    const { applicantId, fileType } = req.params;

    const applicant = await Applicant.findById(applicantId);
    if (!applicant) {
      return res.status(404).json({ message: "Applicant not found" });
    }

    let fileName: string | undefined;
    let filePath: string;

    const baseDir = config.fileServer.dir;

    if ((validFileFields as readonly string[]).includes(fileType)) {
      fileName = applicant.files[fileType as FileField];
      if (!fileName) return res.status(404).json({ error: 'File not uploaded' });

      filePath = path.join(baseDir, 'applicants', fileType, fileName);
    } else if ((validInterviewFields as readonly string[]).includes(fileType)) {
      fileName = applicant.interviews[fileType as InterviewField];
      if (!fileName) return res.status(404).json({ error: 'File not uploaded' });

      filePath = path.join(baseDir, 'applicants', 'file', fileName);
    } else {
      return res.status(400).json({ error: 'Invalid file type' });
    }

    res.download(filePath, fileName, (err) => {
      logger.error(err);
      if (!res.headersSent) {
        res.status(500).end();
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

export const uploadFile = async (req: req, res: res) => {
  try {
    const { applicantId, fileType } = req.params;
    const applicant = await Applicant.findById(applicantId);

    if (!applicant) {
      return res.status(404).json({ message: 'Applicant not found' });
    }

    const validFileFields = [
      'resume', 'medCert', 'birthCert',
      'NBIClearance', 'policeClearance', 'TOR', 'idPhoto',
    ] as const;

    const validInterviewFields = [
      'InitialInterview', 'TechnicalInterview',
      'PanelInterview', 'BehavioralInterview', 'FinalInterview',
    ] as const;

    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    if ((validFileFields as readonly string[]).includes(fileType)) {
      type FileKey = typeof validFileFields[number];
      applicant.files[fileType as FileKey] = file.filename;
    } else if ((validInterviewFields as readonly string[]).includes(fileType)) {
      type InterviewKey = typeof validInterviewFields[number];
      applicant.interviews[fileType as InterviewKey] = file.filename;

      // Update journey status
      const interviewStatusMap: Record<string, keyof typeof applicant.statuses.journey> = {
        InitialInterview: 'isInitialInterview',
        TechnicalInterview: 'isTechnicalInterview',
        PanelInterview: 'isPanelInterview',
        BehavioralInterview: 'isBehavioralInterview',
        FinalInterview: 'isFinalInterview',
      };

      const journeyKey = interviewStatusMap[fileType];
      if (journeyKey) {
        applicant.statuses.journey[journeyKey] = true;
      }
    } else {
      return res.status(400).json({ message: 'Invalid file type' });
    }

    await applicant.save();

    res.status(200).json({
      message: 'File uploaded successfully',
      fileName: file.filename,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'An error occurred', error });
  }
};
