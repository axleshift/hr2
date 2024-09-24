import fs from "fs";
import multer from "multer";
import logger from "../../middleware/logger";
import { upload } from "../../utils/fileUploadHandler";

import Applicant from "../models/applicantModel";
import { config } from "../../config";
import { error } from "console";

const addNewResume = (req: any, res: any) => {
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

      const fileUrl = `${req.protocol}://${req.get("host")}/public/uploads/${
        file.filename
      }`;

      const data = {
        firstName: req.body.firstname || "N/A",
        middleName: req.body.middlename || "N/A",
        lastName: req.body.lastname || "N/A",
        email: req.body.email || "N/A",
        phone: req.body.phone || "N/A",
        address: req.body.address || "N/A",
        resumeFileLoc: file.filename,
      };

      const newApplicant: any = await Applicant.create(data);
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

const updateResume = async (req: any, res: any) => {
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

      const data = {
        firstName: req.body.firstname || "N/A",
        middleName: req.body.middlename || "N/A",
        lastName: req.body.lastname || "N/A",
        email: req.body.email || "N/A",
        phone: req.body.phone || "N/A",
        address: req.body.address || "N/A",
        resumeFileLoc: file.filename,
      };

      // find the file that is currently in the database then delete it from file system
      const applicant: any = await Applicant.findById(req.params.id);
      const filePath = `${config.exposeDir}/uploads/${applicant.resumeFileLoc}`;
      logger.info("UPDATING RESUME: ");
      logger.info(filePath);
      fs.unlink(filePath, (err) => {
        if (err) {
          logger.error(err);
          return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "An error occurred",
            error: err,
          });
        }
      });

      const updatedApplicant: any = await Applicant.findByIdAndUpdate(
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

const getAllResume = async (req: any, res: any) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const applicants = await Applicant.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalApplicants = await Applicant.countDocuments();
    const totalPages = Math.ceil(totalApplicants / limit);
    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Applicants found",
      data: applicants,
      totalApplicants,
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

const getResumeById = async (req: any, res: any) => {
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

const deleteResume = async (req: any, res: any) => {
  try {
    const applicant = await Applicant.findById(req.params.id);
    if (!applicant) {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        message: "Applicant not found",
      });
    }

    const filePath = `${config.exposeDir}/uploads/${applicant.resumeFileLoc}`;
    fs.unlink(filePath, (err) => {
      if (err) {
        logger.error(err);
        return res.status(500).json({
          statusCode: 500,
          success: false,
          message: "An error occurred",
          error: err,
        });
      }
    });

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
};
