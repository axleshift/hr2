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
      job: data.job,
      date: data.date,
      interviewer: new mongoose.Types.ObjectId(interviewerId),
      type: data.type,
      interviewType: data.interviewType,
      event: new mongoose.Types.ObjectId(eventId),
      general: data.general,
      questions: data.questions || [],
      salaryExpectation: data.salaryExpectation,
      strength: data.strength || '',
      weakness: data.weakness || '',
      recommendation: data.recommendation,
      finalComments: data.finalComments || '',
    }

    const interview = await Interview.create(newData)

    if (!interview) {
      return res.status(400).json({ message: "Failed to save interview form" })
    }

    const interviewId = interview._id as mongoose.Types.ObjectId;
    applicant.documentations.interview.push(interviewId)

    switch (data.interviewType) {
      case 'Initial Interview':
        applicant.statuses.journey.isInitialInterview = true
        break;
      case 'Final Interview':
        applicant.statuses.journey.isFinalInterview = true
        break;
      case 'Technical Interview':
        applicant.statuses.journey.isTechnicalInterview = true
        break;
      case 'Panel Interview':
        applicant.statuses.journey.isPanelInterview = true
        break;
      case 'Behavioral Interview':
        applicant.statuses.journey.isBehavioralInterview = true
        break;
      case 'Orientation':
        applicant.statuses.journey.isHired = true
        break;
      default:
        break;
    }

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

    const userId = req.session.user?._id

    // Update the interview record with the new data
    if (data.date) interview.date = data.date;
    if (data.job) interview.job = data.job;
    if (data.type) interview.type = data.type;
    if (data.interviewType) interview.interviewType = data.interviewType;
    if (data.recommendation) interview.recommendation = data.recommendation;
    if (data.general) interview.general = data.general;
    if (data.questions) interview.questions = data.questions;
    if (data.salaryExpectation) interview.salaryExpectation = data.salaryExpectation;
    if (data.strength) interview.strength = data.strength;
    if (data.weakness) interview.weakness = data.weakness;
    // if (data.isReviewed) interview.isReviewed.status = data.isReviewed;
    if (data.finalComments) interview.finalComments = data.finalComments;

    if (data.isReviewed) {
      interview.isReviewed = {
        status: data.isReviewed,
        by: new mongoose.Types.ObjectId(userId)
      }
    }

    // Save the updated interview
    await interview.save();

    // Respond with success
    return res.status(200).json({ message: "Interview updated successfully", data: interview });

  } catch (error) {
    logger.error(error); // Use logger in production if set up
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getInterviewById = async (req: req, res: res) => {
  try {
    const { interviewId } = req.params;

    if (!interviewId) {
      return res.status(400).json({ message: "Interview Id is required" })
    }

    if (!mongoose.Types.ObjectId.isValid(interviewId)) {
      return res.status(400).json({ message: "Invalid Interview ID format" });
    }

    // Fetch the interview by its ID
    const interview = await Interview.findById(interviewId)
      .populate([
        {
          path: "applicant",
          model: "Applicant",
          select: "_id firstname lastname isShortlisted isInitialInterview isFinalInterview isJobOffer isHired"
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
      .lean();

    // If interview not found
    if (!interview) {
      return res.status(404).json({ message: "Interview not found", interviewId });
    }

    return res.status(200).json({
      data: interview,
    });

  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Internal Server Error" });
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
            select: "_id firstname lastname isShortlisted isInitialInterview isFinalInterview isJobOffer isHired"
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

export const getAllRecentInterviews = async (req: req, res: res) => {
  try {
    const searchQuery = req.query.query as string;
    const status = req.query.status as 'yes' | 'no' | 'need further review' | undefined;  // Status filter
    const page = typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
    const limit = typeof req.query.limit === "string" ? parseInt(req.query.limit) : 10;
    const skip = (page - 1) * limit;

    // Define the search filter
    type InterviewSearchFilter = {
      recommendation?: 'yes' | 'no' | 'need further review'; // Include recommendation status
      $or?: Array<{
        recommendation?: { $regex: string; $options: string };
        strength?: { $regex: string; $options: string };
        weakness?: { $regex: string; $options: string };
        finalComments?: { $regex: string; $options: string };
      }>;
    };

    // Initialize the search filter
    const searchFilter: InterviewSearchFilter = {};

    // Add status filter if provided
    if (status) {
      searchFilter.recommendation = status;  // Filter by recommendation status
    }

    // Add search conditions if a query exists
    if (searchQuery) {
      searchFilter.$or = [
        { recommendation: { $regex: searchQuery, $options: "i" } },
        { strength: { $regex: searchQuery, $options: "i" } },
        { weakness: { $regex: searchQuery, $options: "i" } },
        { finalComments: { $regex: searchQuery, $options: "i" } },
      ];
    }

    // Get the most recent interviews with pagination
    const [interviews, totalItems] = await Promise.all([
      Interview.find(searchFilter)
        .populate([
          {
            path: "applicant",
            model: "Applicant",
            select: "_id firstname lastname isShortlisted isInitialInterview isisFinalInterview isJobOffer isHired"
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
        .sort({ date: -1 })  // Sort by most recent interview date
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
