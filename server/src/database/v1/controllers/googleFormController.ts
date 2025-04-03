import Applicant from "../models/applicantModel";
import { Request as req, Response as res } from "express";
import { config } from "../../../config";
import logger from "../../../middlewares/logger";
import path from "path";
import fs from "fs/promises";
import { sendEmail } from "../../../utils/mailHandler";

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

    if (!newApplicant) {
      return res.status(400).json({ message: "Failed to submit application" });
    }

    const fullName = `${firstname} ${lastname}`;
    const applicationDate = new Date().toLocaleDateString();
    const referenceNumber = newApplicant._id as string

    // Fixing typo in template file name
    const templatePath = path.join(__dirname, "../../../public/template/applicationReceived.html");
    
    // Ensure the template file exists before reading
    try {
      await fs.access(templatePath);
    } catch (err) {
      logger.error("Email template file not found:", err);
      return res.status(500).json({ message: "Email template missing" });
    }

    let emailTemplate = await fs.readFile(templatePath, "utf-8");

    // Replacing placeholders in the email template
    emailTemplate = emailTemplate
      .replace(/{{fullName}}/g, fullName)
      .replace(/{{applicationDate}}/g, applicationDate)
      .replace(/{{referenceNumber}}/g, referenceNumber)
      .replace(/{{jobTitle}}/g, jobAppliedFor)
      .replace(/{{responseTimeframe}}/g, "two weeks");

    // Sending email notification
    const emailResult = await sendEmail(
      "Application Received",
      email,
      "Your Job Application at Our Company",
      emailTemplate
    );

    if (emailResult) {
      logger.info(`Email notification sent to ${fullName} (${email})`);
    } else {
      logger.warn(`Failed to send email notification to ${fullName} (${email})`);
    }

    res.status(201).json({
      statusCode: 201,
      success: true,
      message: "Application submitted successfully. A confirmation email has been sent.",
      data: newApplicant,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
