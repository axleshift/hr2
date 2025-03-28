/**
 * @file applicant.ts
 * @description Applicant model schema
 */

import mongoose from "mongoose";
const applicantSchema = new mongoose.Schema(
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
     * skills and qualifications
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
     * Job specific questions
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

    // Statuses and remarks for each stage
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
      screening: {
        remarks: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Document",
          }
        ],
      },
      interview: {
        remarks: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Document",
          }
        ],
      },
      training: {
        remarks: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Document",
          }
        ],
      },
      others: {
        remarks: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Document",
          }
        ],
      }
    },
    // documents: {
    //   type: [mongoose.Schema.Types.ObjectId],
    //   ref: "Document",
    // },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  },
  {
    timestamps: true,
    updateAt: true,
  }
);

export default mongoose.model("Applicant", applicantSchema);
