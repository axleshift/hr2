import JobpostingRequest from "../models/jobpostingRequestModel";
import logger from "../../../middlewares/logger";
import { Request as req, Response as res } from "express";
import ScreeningDocuments from "../models/screeningFormModel";
import InterviewDocuments from "../models/interviewFormModel";
import { config } from "../../../config";

export const createJobpostingRequest = async (req: req, res: res) => {
  try {
    const { title, description, quantity, location, jobType, salaryRange, contact, email, phone } = req.body;

    const apikey = req.headers['x-api-key']
    const key = config.api.hr1Key;

    if (!apikey || apikey !== key) {
      return res.status(403).json({ message: "Invalid or missing API key" });
    }

    if (!title || !quantity || !location || !jobType || !salaryRange) {
      return res.status(400).send("Please provide all required fields");
    }

    const data = new JobpostingRequest({
      title,
      description,
      quantity,
      location,
      jobType,
      salaryRange,
      contact,
      email,
      phone,
    });
    await data.save();
    res.status(201).send(data);
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
};

export const updateJobpostingRequest = async (req: req, res: res) => {
  try {
    const { title, description, quantity, location, jobType, salaryRange, contact, email, phone, status } = req.body;

    const apikey = req.headers['x-api-key']
    const key = config.api.hr1Key;

    if (!apikey || apikey !== key) {
      return res.status(403).json({ message: "Invalid or missing API key" });
    }

    if (!title || !quantity || !location || !jobType || !salaryRange || !status) {
      return res.status(400).send("Please provide all required fields");
    }

    const data = await JobpostingRequest.findById(req.params.id);
    if (!data) {
      return res.status(404).send("Jobposting request not found");
    }

    data.title = title;
    data.description = description;
    data.quantity = quantity;
    data.location = location;
    data.jobType = jobType;
    data.salaryRange = salaryRange;
    data.contact = contact;
    data.email = email;
    data.phone = phone;
    data.status = status;

    await data.save();
    res.status(200).send(data);
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
}

export const searchJobpostingRequests = async (req: req, res: res) => {
  try {
    const { title, location, jobType, salaryRange, status } = req.query;

    const apikey = req.headers['x-api-key']
    const key = config.api.hr1Key;

    if (!apikey || apikey !== key) {
      return res.status(403).json({ message: "Invalid or missing API key" });
    }

    const query: Record<string, unknown> = {};
    if (title) query.title = title;
    if (location) query.location = location;
    if (jobType) query.jobType = jobType;
    if (salaryRange) query.salaryRange = salaryRange;
    if (status) query.status = status;
    const data = await JobpostingRequest.find(query);
    res.status(200).send(data);
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
};

export const getJobpostingRequestById = async (req: req, res: res) => {
  try {
    const data = await JobpostingRequest.findById(req.params.id);
    const apikey = req.headers['x-api-key']
    const key = config.api.hr1Key;

    if (!apikey || apikey !== key) {
      return res.status(403).json({ message: "Invalid or missing API key" });
    }

    if (!data) {
      return res.status(404).send("Jobposting request not found");
    }
    res.status(200).send(data);
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
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

    if (searchQuery) {
      searchCriteria = {
        $or: [
          { title: { $regex: searchQuery, $options: "i" } },
          { description: { $regex: searchQuery, $options: "i" } },
          { author: { $regex: searchQuery, $options: "i" } },
        ],
      };
    }

    switch (documentType) {
      case 'screening':
        data = await ScreeningDocuments.find(searchCriteria).limit(10);
        break;

      case 'interview':
        data = await InterviewDocuments.find(searchCriteria).limit(10);
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