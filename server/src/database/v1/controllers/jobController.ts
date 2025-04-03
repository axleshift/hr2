import logger from "../../../middlewares/logger"
import Job from "../models/jobModel"
import { Request as req, Response as res } from "express";
import Jobposting from "../models/jobpostingModel";
import mongoose from "mongoose";

export const createJob = async (req: req, res: res) => {
  try {
    const { title, responsibilities, requirements, qualifications, benefits, category, capacity } = req.body;

    if (!title || !responsibilities || !requirements || !qualifications || !benefits || !category) {
      return res.status(400).json({ message: "All fields are required" })
    }

    const userId = req.session.user?._id

    const jobData = {
      title,
      author: new mongoose.Types.ObjectId(userId),
      responsibilities,
      requirements,
      qualifications,
      benefits,
      category,
      capacity,
    }

    const newJob = await Job.create(jobData)

    if (!newJob) {
      return res.status(500).json({ message: "Job not created" })
    }

    return res.status(201).json({ message: "New job created", data: newJob })
  } catch (error) {
    logger.error(error)
    res.status(500).json({ message: "Internal server error" })
  }
}

export const updateJob = async (req: req, res: res) => {
  try {
    const { jobId } = req.params;
    const { title, responsibilities, requirements, qualifications, benefits, category, capacity } = req.body;

    if (!jobId) {
      return res.status(400).json({ message: "Job Id is required" })
    }

    if (!title || !responsibilities || !requirements || !qualifications || !benefits || !category) {
      return res.status(400).json({ message: "All fields are required" })
    }

    const job = await Job.findById(jobId)

    if (!job) {
      return res.status(404).json({ message: "Job not found" })
    }

    job.title = title

    job.responsibilities = responsibilities
    job.requirements = requirements
    job.qualifications = qualifications
    job.benefits = benefits
    job.category = category
    job.capacity = capacity

    const updatedJob = await job.save()

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not updated" })
    }

    return res.status(201).json({ message: "job updated", data: updatedJob })
  } catch (error) {
    logger.error(error)
    res.status(500).json({ message: "Internal server error" })
  }
}

export const getJobById = async (req: req, res: res) => {
  try {
    const { jobId } = req.params

    if (!jobId) {
      return res.status(500).json({ message: "Job Id is required" })
    }

    const job = await Job.findById(jobId)

    if (!job) {
      return res.status(404).json({ message: "Job not found" })
    }

    return res.status(200).json({ message: "Job found", data: job })
  } catch (error) {
    logger.error(error)
    return res.status(500).json({ message: "Internal server error" })
  }
}

export const getAllJob = async (req: req, res: res) => {
  try {
    const searchQuery = req.query.query as string;
    const page = typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
    const limit = typeof req.query.limit === "string" ? parseInt(req.query.limit) : 10;
    const skip = (page - 1) * limit;
    const sortOrder = req.query.sort === "desc" ? -1 : 1;

    let searchFilter = {};
    if (searchQuery) {
      searchFilter = {
        $or: [
          { title: { $regex: searchQuery, $options: "i" } },
          { responsibilities: { $regex: searchQuery, $options: "i" } },
          { requirements: { $regex: searchQuery, $options: "i" } },
          { qualifications: { $regex: searchQuery, $options: "i" } },
          { benefits: { $regex: searchQuery, $options: "i" } },
        ],
      };
    }

    const totalItems = await Job.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalItems / limit);

    const jobs = await Job.find(searchFilter).sort({ createdAt: sortOrder }).skip(skip).limit(limit);

    if (jobs.length === 0) {
      const msg = searchQuery ? `No jobs found for query: ${searchQuery}` : "No jobs found";
      return res.status(404).json({ message: msg });
    }

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Jobs found",
      data: jobs,
      totalItems,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const createJobpostingFromJob = async (req: req, res: res) => {
  try {
    const { jobId } = req.params;
    const {
      title,
      type,
      salary_min,
      salary_max,
      location,
      description,
      requirements,
      responsibilities,
      benefits,
      status,
      schedule_start,
      schedule_end,
    } = req.body;

    if (!jobId) {
      return res.status(400).json({ message: "Job Id is required" })
    }

    const job = await Job.findById(jobId)
    if (!job) {
      return res.status(404).json({ message: "Job not found" })
    }

    const newJobpost = await Jobposting.create({
      title,
      type,
      // company,
      salary_min,
      salary_max,
      location,
      description,
      requirements,
      responsibilities,
      benefits,
      status,
      schedule_start,
      schedule_end,
      isExpired: false,
    })

    job.jobpost = new mongoose.Types.ObjectId(newJobpost._id)
    const jobSave = await job.save()

    if (!newJobpost && !jobSave) {
      return res.status(500).json({ message: "Failed to create jobposting", data: req.body})
    }

    return res.status(200).json({ message: "Jobposting successfully created", data: newJobpost})
  } catch (error) {
    logger.error(error)
    res.status(500).json({})
  }
}
