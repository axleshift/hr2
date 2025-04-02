import logger from "../../../middlewares/logger";
import { Request as req, Response as res } from "express";
import ScreeningDocuments from "../models/screeningFormModel";
import InterviewDocuments from "../models/interviewFormModel";
import { config } from "../../../config";
import jobModel from "../models/jobModel";

export const externalPostJob = async (req: req, res: res) => {
  try {
    const { title, responsibilities, requirements, qualifications, benefits, category, capacity } = req.body;

    const apikey = req.headers['x-api-key']
    const key = config.api.hr1Key;

    if (!apikey || apikey !== key) {
      return res.status(403).json({ message: "Invalid or missing API key" });
    }

    if (!title || !responsibilities || !requirements || !qualifications || !benefits || !category) {
      return res.status(400).json({ message: "All fields are required" })
    }

    const jobData = {
      title,
      author: "hr1",
      responsibilities,
      requirements,
      qualifications,
      benefits,
      category,
      capacity,
    }

    const newJob = await jobModel.create(jobData)

    if (!newJob) {
      return res.status(500).json({ message: "Job not created" })
    }

    return res.status(201).json({ message: "New job created", data: newJob })
  } catch (error) {
    logger.error(error)
    res.status(500).json({ message: "Internal server error" })
  }
}

export const getApplicantDocuments = async (req: req, res: res) => {
  try {
    const { documentType } = req.params;
    const apikey = req.headers['x-api-key'];
    const searchQuery = req.query.query as string;
    const key = config.api.adminKey;

    if (!apikey || apikey !== key) {
      return res.status(403).json({ message: "Invalid or missing API key" });
    }

    if (!documentType) {
      return res.status(400).json({ message: "Document Type is required", documentType });
    }

    let data;
    let searchCriteria = {};

    switch (documentType) {
      case 'screening':
        if (searchQuery) {
          searchCriteria = {
            $or: [
              { applicant: { $regex: searchQuery, $options: "i" } },
              { reviewer: { $regex: searchQuery, $options: "i" } },
              { status: { $regex: searchQuery, $options: "i" } },
              { recommendation: { $regex: searchQuery, $options: "i" } },
              { job: { $regex: searchQuery, $options: "i" } },
            ],
          };
        }

        data = await ScreeningDocuments.find(searchCriteria).limit(10)
          .populate([
            {
              path: "applicant",
              model: "Applicant",
              select: "_id firstname lastname middlename",
            },
            {
              path: "reviewer",
              model: "User",
              select: "_id firstname lastname role",
            },
            {
              path: "job",
              model: "Job"
            }
          ])
        break;

      case 'interview':
        if (searchQuery) {
          searchCriteria = {
            $or: [
              { applicant: { $regex: searchQuery, $options: "i" } },
              { interviewer: { $regex: searchQuery, $options: "i" } },
              { type: { $regex: searchQuery, $options: "i" } },
              { recommendation: { $regex: searchQuery, $options: "i" } },
              { finalComments: { $regex: searchQuery, $options: "i" } },
            ],
          };
        }
        data = await InterviewDocuments.find(searchCriteria).limit(10)
        break;

      default:
        return res.status(400).json({ message: "Please use a valid document type", documentType });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "No documents found", documentType });
    }

    res.status(200).json({ message: "Documents found!", documentType, data });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "An error occurred", error });
  }
}