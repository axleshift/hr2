import mongoose from "mongoose";
import Jobposting from "../models/jobpostingModel";

/**
 * Creates a new job posting in the database.
 *
 * @param req - The HTTP request object containing the job posting data.
 * @param res - The HTTP response object to send the result.
 * @param next - The next middleware function in the request-response cycle.
 * @returns A JSON response with the created job posting.
 */
const createJobposting = async (req: any, res: any, next: any) => {
  const {
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
    facebook,
    twitter,
  } = req.body;

  try {
    const jobposting = await Jobposting.create({
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
      facebook,
      twitter,
    });
    res.status(200).json({
      status: 200,
      message: "Jobposting created successfully",
      jobposting,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: "Error creating jobposting",
      error,
    });
  }
};

const searchJobpostings = async (req: any, res: any, next: any) => {
  const searchQuery = req.query.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 9;
  const skip = (page - 1) * limit;

  try {
    const totalJobpostings = await Jobposting.countDocuments({
      $or: [
        { title: { $regex: searchQuery, $options: "i" } },
        { type: { $regex: searchQuery, $options: "i" } },
        { company: { $regex: searchQuery, $options: "i" } },
        { location: { $regex: searchQuery, $options: "i" } },
      ],
    });

    const data = await Jobposting.find({
      $or: [
        { title: { $regex: searchQuery, $options: "i" } },
        { type: { $regex: searchQuery, $options: "i" } },
        { company: { $regex: searchQuery, $options: "i" } },
        { location: { $regex: searchQuery, $options: "i" } },
      ],
    })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      status: 200,
      message: "Jobpostings retrieved successfully",
      data,
      total: totalJobpostings,
      totalPages: Math.ceil(totalJobpostings / limit),
      currentPage: page,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: "Error retrieving jobpostings",
      error,
    });
  }
};

/**
 * Retrieves all job postings from the database.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @param next - The next middleware function in the request-response cycle.
 * @returns A JSON response containing all the job postings.
 */
const getAllJobpostings = async (req: any, res: any, next: any) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;
    const totalJobpostings = await Jobposting.countDocuments();
    const jobpostings = await Jobposting.find().skip(skip).limit(limit);

    res.status(200).json({
      status: 200,
      message: "Job postings retrieved successfully",
      data: jobpostings,
      total: totalJobpostings,
      totalPages: Math.ceil(totalJobpostings / limit),
      currentPage: page,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: "Error retrieving job postings",
      error,
    });
  }
};

const getAllSheduledJobpostings = async (req: any, res: any, next: any) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;
    // const startDate = req.query.startDate;
    // const endDate = req.query.endDate;
    const today = new Date();

    const totalJobpostings = await Jobposting.countDocuments({
      schedule_start: { $lte: today },
      schedule_end: { $gte: today },
    });

    const data = await Jobposting.find({
      schedule_start: { $lte: today },
      schedule_end: { $gte: today },
    })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      status: 200,
      message: "Job postings retrieved successfully",
      data,
      total: totalJobpostings,
      totalPages: Math.ceil(totalJobpostings / limit),
      currentPage: page,
    });
  } catch (error) {
    console.log(error);
  }
};

/**
 * Retrieves a job posting from the database by its unique identifier.
 *
 * @param req - The HTTP request object, which should contain the `id` parameter in the URL path.
 * @param res - The HTTP response object, which will be used to send the retrieved job posting.
 * @param next - The next middleware function in the request-response cycle.
 * @returns A JSON response containing the retrieved job posting.
 */
const getJobpostingById = async (req: any, res: any, next: any) => {
  const { id } = req.params;
  console.log(id);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid jobposting id",
    });
  }

  try {
    const jobposting = await Jobposting.findById(id);
    res.status(200).json({
      status: 200,
      message: "Jobposting retrieved successfully",
      data: jobposting,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: "Error retrieving jobposting",
      error,
    });
  }
};

/**
 * Updates a job posting in the database.
 *
 * @param req - The HTTP request object, which should contain the `id` parameter in the URL path and the updated job posting data in the request body.
 * @param res - The HTTP response object, which will be used to send the updated job posting.
 * @param next - The next middleware function in the request-response cycle.
 * @returns A JSON response containing the updated job posting.
 */
const updateJobposting = async (req: any, res: any, next: any) => {
  const { id } = req.params;
  console.log(req.body);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid jobposting id",
    });
  }
  let defStatus = "active";
  if (!req.body.status) {
    defStatus = "active";
  }

  const {
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
    facebook,
    twitter,
  } = req.body;
  try {
    const jobposting = await Jobposting.findByIdAndUpdate(
      id,
      {
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
        facebook,
        twitter,
      },
      { new: true }
    );
    res.status(200).json({
      status: 200,
      message: "Jobposting updated successfully",
      jobposting: jobposting,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: "Error updating jobposting",
      error,
    });
  }
};

const deleteJobposting = async (req: any, res: any, next: any) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid jobposting id",
    });
  }

  try {
    const jobposting = await Jobposting.findByIdAndDelete(id);
    res.status(200).json({
      status: 200,
      message: "Jobposting deleted successfully",
      jobposting: jobposting,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: "Error deleting jobposting",
      error,
    });
  }
};

export {
  createJobposting,
  searchJobpostings,
  getAllJobpostings,
  getAllSheduledJobpostings,
  getJobpostingById,
  updateJobposting,
  deleteJobposting,
};
