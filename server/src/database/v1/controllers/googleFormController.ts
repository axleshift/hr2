import Applicant from "../models/applicant";
import { Request as req, Response as res } from "express";
import { config } from "../../../config";
import logger from "../../../middlewares/logger";

export const formSubmit = async (req: req, res: res) => {
  try {
    const {
      secret,
      firstname,
      lastname,
      middlename,
      suffix,
      email,
      phone,
      address,
      preferredWorkLocation,
      linkedInProfile,
      portfolioLink,
      resumeFileLoc,
      yearsOfExperience,
      currentMostRecentJob,
      highestQualification,
      majorFieldOfStudy,
      institution,
      graduationYear,
      keySkills,
      softwareProficiency,
      certifications,
      salaryExpectation,
      jobAppliedFor,
      availability,
      whyAreYouInterestedInRole,
    } = req.body;

    const SECRET = config.google.key;

    if (secret !== SECRET) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const newApplicant = await Applicant.create({
      firstname,
      lastname,
      middlename,
      suffix,
      email,
      phone,
      address,
      preferredWorkLocation,
      linkedInProfile,
      portfolioLink,
      resumeFileLoc: resumeFileLoc[0],
      yearsOfExperience,
      currentMostRecentJob,
      highestQualification,
      majorFieldOfStudy,
      institution,
      graduationYear,
      keySkills,
      softwareProficiency,
      certifications,
      salaryExpectation,
      jobAppliedFor,
      availability,
      whyAreYouInterestedInRole,
    });

    res.status(201).json({ statusCode: 201, success: true, message: "Application submitted successfully", data: newApplicant });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
