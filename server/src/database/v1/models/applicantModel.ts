/**
 * @file applicant.ts
 * @description Applicant model schema
 */

import mongoose, { Document } from "mongoose";

export interface IApplicant extends Document {
  /**
   * Basic Information
   */
  firstname: string;
  lastname: string;
  middlename?: string;
  suffix?: string;
  email: string;
  phone?: string;
  address?: string;
  preferredWorkLocation?: string;
  linkedInProfile?: string;
  portfolioLink?: string;

  /**
   * Work Experience
   */
  resumeFileLoc?: string;
  yearsOfExperience: number;
  currentMostRecentJob?: string;

  /**
   * Education
   */
  highestQualification: string;
  majorFieldOfStudy: string;
  institution?: string;
  graduationYear?: number;

  /**
   * Skills and Qualifications
   */
  keySkills: string;
  softwareProficiency?: string;
  certifications?: string;

  /**
   * Job Specific Questions
   */
  coverLetter?: string;
  salaryExpectation?: number;
  availability: string;
  jobAppliedFor: string;
  whyInterestedInRole?: string;

  /**
   * Statuses and Remarks for Each Stage
   */
  tags: string[];
  emailSent: boolean;
  isShortlisted: boolean;
  isInitialInterview: boolean;
  isFinalInterview: boolean;
  isInTraining: boolean;
  isHired: boolean;

  events: mongoose.Types.ObjectId[];
  emails: mongoose.Types.ObjectId[];

  documentations: {
    screening: mongoose.Types.ObjectId[];
    interview: mongoose.Types.ObjectId[];
    training: mongoose.Types.ObjectId[];
    others: mongoose.Types.ObjectId[];
  }
  expiresAt: Date;
}

const applicantSchema = new mongoose.Schema<IApplicant>(
  {
    /**
     * Basic Information
     */
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    middlename: {
      type: String,
    },
    suffix: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    preferredWorkLocation: {
      type: String,
    },
    linkedInProfile: {
      type: String,
      // (optional) link to LinkedIn profile
    },
    portfolioLink: {
      type: String,
      // (optional) link to portfolio
    },

    /**
     * Work Experience
     */
    resumeFileLoc: {
      type: String,
    },
    yearsOfExperience: {
      type: Number,
      required: true,
    },
    currentMostRecentJob: {
      type: String,
      // (optional) current or most recent job
    },

    /**
     * Education
     */

    highestQualification: {
      type: String,
      required: true,
    },
    majorFieldOfStudy: {
      type: String,
      required: true,
    },
    institution: {
      type: String,
      // (optional) institution name
    },
    graduationYear: {
      type: Number,
      // (optional) graduation year
    },

    /**
     * Skills and Qualifications
     */

    keySkills: {
      type: String,
      required: true,
    },

    softwareProficiency: {
      type: String,
      // (optional) software proficiency
    },

    certifications: {
      type: String,
      // (optional) certifications
    },

    /**
     * Job Specific Questions
     */
    coverLetter: {
      type: String,
      // (optional) cover letter
    },
    salaryExpectation: {
      type: Number,
      // (optional) salary expectation
    },
    availability: {
      type: String,
      required: true,
    },

    jobAppliedFor: {
      type: String,
      required: true,
    },

    whyInterestedInRole: {
      type: String,
      // (optional) why interested in role
    },

    // Statuses and Remarks for Each Stage
    tags: {
      type: [String],
      required: true,
    },
    emailSent: {
      type: Boolean,
      default: false,
    },
    isShortlisted: {
      type: Boolean,
      default: false,
    },
    isInitialInterview: {
      type: Boolean,
      default: false,
    },
    isFinalInterview: {
      type: Boolean,
      default: false,
    },
    isInTraining: {
      type: Boolean,
      default: false,
    },
    isHired: {
      type: Boolean,
      default: false,
    },
    events: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    }],
    emails: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Email"
    }],
    documentations: {
      screening:  [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ScreeningForm",
          }
        ],
      interview: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Document",
        }
      ],
      training: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Document",
        }
      ],
      others: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Document",
        }
      ]
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IApplicant>("Applicant", applicantSchema);
