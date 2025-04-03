import logger from "../../../middlewares/logger";
import Applicant from "../models/applicantModel";
import { Request as req, Response as res } from "express";
import Interview from "../models/interviewFormModel";
import FacilityEvents from "../models/facilityEventModel";
import mongoose from "mongoose";

export const createInterview = async (req: req, res: res) => {
  try {
    const { applicantId, eventId } = req.params;
    const data = req.body;

    // Guard clause for missing applicantId
    if (!applicantId) {
      return res.status(400).json({ message: "Applicant ID is required", applicantId });
    }

    // Find the applicant by ID
    const applicant = await Applicant.findById(applicantId);
    if (!applicant) {
      return res.status(404).json({ message: "Applicant not found", applicantId });
    }

    // Guard clause for missing eventId
    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required", eventId });
    }

    const event = await FacilityEvents.findById(eventId)
    if (!event) {
      return res.status(404).json({ message: "Event not found", eventId });
    }

    // Get the interviewer ID from the session
    const interviewerId = req.session.user?._id;
    if (!interviewerId) {
      return res.status(400).json({ message: "Interviewer ID is required" });
    }
    
    // Guard clause for missing interview data
    if (!data) {
      return res.status(400).json({ message: "Interview data is required" });
    }


    // Guard clause for missing required fields
    if (!data.date || !data.type || !data.recommendation) {
      return res.status(400).json({ message: "Missing required fields in interview data" });
    }

    // Guard clause for missing or invalid 'general' field
    if (!data.general || !Object.keys(data.general).length) {
      return res.status(400).json({ message: "General ratings are required" });
    }

    // Validate ratings in 'general' field (optional, based on your rating scale)
    const ratingFields = ['communication', 'technical', 'problemSolving', 'culturalFit', 'workExperienceRelevance', 'leadership'];
    for (const field of ratingFields) {
      if (typeof data.general[field] !== 'number' || data.general[field] < 1 || data.general[field] > 5) {
        return res.status(400).json({ message: `Invalid rating for ${field}. Ratings should be between 1 and 5` });
      }
    }

    // Create the interview record
    const newData = {
      applicant: new mongoose.Types.ObjectId(applicantId),
      date: data.date,
      interviewer: new mongoose.Types.ObjectId(interviewerId),
      type: data.type,
      event: new mongoose.Types.ObjectId(eventId),
      general: data.general,
      questions: data.questions || [],
      strength: data.strength || '',
      weakness: data.weakness || '',
      recommendation: data.recommendation,
      finalComments: data.finalComments || '',
    }

    const interview = await Interview.create(newData)

    if (!interview) {
      return res.status(400).json({ message: "Failed to save interview form"})
    }

    const interviewId = interview._id as mongoose.Types.ObjectId;
    applicant.documentations.interview.push(interviewId)
    applicant.save()

    // Respond with success
    return res.status(201).json({ message: "Interview created successfully", data: interview });

  } catch (error) {
    logger.error(error); // Use logger in production if set up
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateInterview = async (req: req, res: res) => {
  try {
    const { interviewId } = req.params;
    const data = req.body;

    // Guard clause for missing interviewId
    if (!interviewId) {
      return res.status(400).json({ message: "Interview ID is required" });
    }

    // Find the interview by ID
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: "Interview not found", interviewId });
    }

    // Guard clause for missing interview data
    if (!data) {
      return res.status(400).json({ message: "Interview data is required" });
    }

    // Guard clause for missing required fields
    if (data.date && !data.type && !data.recommendation) {
      return res.status(400).json({ message: "Missing required fields in interview data" });
    }

    // Guard clause for missing or invalid 'general' field
    if (data.general && (!Object.keys(data.general).length || !data.general)) {
      return res.status(400).json({ message: "General ratings are required" });
    }

    // Validate ratings in 'general' field (optional, based on your rating scale)
    if (data.general) {
      const ratingFields = ['communication', 'technical', 'problemSolving', 'culturalFit', 'workExperienceRelevance', 'leadership'];
      for (const field of ratingFields) {
        if (typeof data.general[field] !== 'number' || data.general[field] < 1 || data.general[field] > 5) {
          return res.status(400).json({ message: `Invalid rating for ${field}. Ratings should be between 1 and 5` });
        }
      }
    }

    // Update the interview record with the new data
    if (data.date) interview.date = data.date;
    if (data.type) interview.type = data.type;
    if (data.recommendation) interview.recommendation = data.recommendation;
    if (data.general) interview.general = data.general;
    if (data.questions) interview.questions = data.questions;
    if (data.strength) interview.strength = data.strength;
    if (data.weakness) interview.weakness = data.weakness;
    if (data.finalComments) interview.finalComments = data.finalComments;

    // Save the updated interview
    await interview.save();

    // Respond with success
    return res.status(200).json({ message: "Interview updated successfully", data: interview });

  } catch (error) {
    logger.error(error); // Use logger in production if set up
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllInterview = async (req: req, res: res) => {
  try {
    const { applicantId } = req.params;

    const searchQuery = req.query.query as string;
    const page = typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
    const limit = typeof req.query.limit === "string" ? parseInt(req.query.limit) : 10;
    const skip = (page - 1) * limit;
    const sortOrder = req.query.sort === "desc" ? -1 : 1;

    if (!mongoose.Types.ObjectId.isValid(applicantId)) {
      return res.status(400).json({ message: "Invalid Applicant ID format" });
    }

    // First verify the applicant exists
    const applicantExists = await Applicant.exists({ _id: applicantId });
    if (!applicantExists) {
      return res.status(404).json({ message: "Applicant not found", applicantId });
    }

    // Define proper type for the search filter
    type InterviewSearchFilter = {
      applicant: mongoose.Types.ObjectId;
      $or?: Array<{
        recommendation?: { $regex: string; $options: string };
        strength?: { $regex: string; $options: string };
        weakness?: { $regex: string; $options: string };
        finalComments?: { $regex: string; $options: string };
      }>;
    };

    // Initialize with required applicant filter
    const searchFilter: InterviewSearchFilter = { 
      applicant: new mongoose.Types.ObjectId(applicantId) 
    };

    // Add search conditions if query exists
    if (searchQuery) {
      searchFilter.$or = [
        { recommendation: { $regex: searchQuery, $options: "i" } },
        { strength: { $regex: searchQuery, $options: "i" } },
        { weakness: { $regex: searchQuery, $options: "i" } },
        { finalComments: { $regex: searchQuery, $options: "i" } },
      ];
    }

    // Get the interviews with pagination
    const [interviews, totalItems] = await Promise.all([
      Interview.find(searchFilter)
        .populate([
          {
            path: "applicant",
            model: "Applicant",
            select: "_id firstname lastname"
          },
          {
            path: "interviewer",
            model: "User",
            select: "_id firstname lastname"
          },
          {
            path: "event",
            model: "FacilityEvent"
          }
        ])
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      
      Interview.countDocuments(searchFilter)
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return res.status(200).json({
      data: interviews,
      totalItems,
      totalPages,
      currentPage: page,
    });

  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
