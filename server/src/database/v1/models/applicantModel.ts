/**
 * @file applicant.ts
 * @description Applicant model schema
 */

const APPLICANT_STATUS = ['Rejected', 'Hired', 'Active']

import mongoose, { Document, Types } from "mongoose";

export interface IApplicantBase extends Document {
  status: string;
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
   * Files location. These are all saved in the local filesystem.
   * which is why they're all string.
   * some of this are not actual files but numbers or strings.. so thats convenient.
   * 
   * For several government-mandated pre-employment requirements in the Philippines, 
   * you typically only need to provide your identification numbers, 
   * not the physical IDs—unless the employer specifically requested them.
   */
  files: {
    resume?: string;
    medCert?: string;
    birthCert?: string;
    NBIClearance?: string;
    policeClearance?: string;
    TOR?: string; // Transcript of record
    idPhoto?: string;
  }

  interviews: {
    InitialInterview: string;
    TechnicalInterview: string;
    PanelInterview: string;
    BehavioralInterview: string;
    FinalInterview: string;
  }

  ids: {
    TIN?: string;
    SSS?: string;
    philHealth?: string;
    pagIBIGFundNumber?: string;
  }

  /**
   * Statuses and Remarks for Each Stage
   */
  statuses: {
    journey: {
      isShortlisted: boolean;
      isInitialInterview: boolean;
      isTechnicalInterview: boolean;
      isPanelInterview: boolean;
      isBehavioralInterview: boolean;
      isFinalInterview: boolean;
      isJobOffer: boolean;
      isHired: boolean;
      withdrawn: boolean;
    },
    // preemployment: {
    //   files: {
    //     medCert?: boolean;
    //     birthCert?: boolean;
    //     NBIClearance?: boolean;
    //     policeClearance?: boolean;
    //     TOR?: boolean;
    //     idPhoto?: boolean;
    //   },
    //   ids: {
    //     TIN?: boolean;
    //     SSS?: boolean;
    //     philHealth?: boolean;
    //     pagIBIGFundNumber?: boolean;
    //   }
    // }
  },

  tags: string[];
  emailSent: boolean;
  events: mongoose.Types.ObjectId[];
  emails: mongoose.Types.ObjectId[];

  documentations: {
    screening: mongoose.Types.ObjectId[];
    interview: mongoose.Types.ObjectId[];
    jobOffer: mongoose.Types.ObjectId;
    others: mongoose.Types.ObjectId[];
  }
  expiresAt: Date;
}

export interface IApplicant extends IApplicantBase, Document {
  _id: Types.ObjectId,
}

const applicantSchema = new mongoose.Schema<IApplicant>(
  {
    /**
     * Basic Information
     */
    status: {
      type: String,
      enum: APPLICANT_STATUS,
      default: 'Active',
      required: true,
    },

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

    files: {
      resume: {
        type: String,
      },
      medCert: {
        type: String,
      },
      birthCert: {
        type: String,
      },
      NBIClearance: {
        type: String,
      },
      policeClearance: {
        type: String,
      },
      TOR: {
        type: String,
      },
      idPhoto: {
        type: String,
      },
    },

    interviews: {
      InitialInterview: {
        type: String,
      },
      TechnicalInterview: {
        type: String,
      },
      PanelInterview: {
        type: String,
      },
      BehavioralInterview: {
        type: String,
      },
      FinalInterview: {
        type: String,
      },
    },
  
    ids: {
      TIN: {
        type: String,
      },
      SSS: {
        type: String,
      },
      philHealth: {
        type: String,
      },
      pagIBIGFundNumber: {
        type: String,
      },
    },

    statuses: {
      journey: {
        isShortlisted: {
          type: Boolean,
          default: false,
        },
        isInitialInterview: {
          type: Boolean,
          default: false,
        },
        isTechnicalInterview: {
          type: Boolean,
          default: false,
        },
        isPanelInterview: {
          type: Boolean,
          default: false,
        },
        isBehavioralInterview: {
          type: Boolean,
          default: false,
        },
        isFinalInterview: {
          type: Boolean,
          default: false,
        },
        isJobOffer: {
          type: Boolean,
          default: false,
        },
        isHired: {
          type: Boolean,
          default: false,
        },
        withdrawn: {
          type: Boolean,
          default: false,
        },
      },
      // preemployment: {
      //   files: {
      //     medCert: {
      //       type: Boolean,
      //       default: false,
      //     },
      //     birthCert: {
      //       type: Boolean,
      //       default: false,
      //     },
      //     NBIClearance: {
      //       type: Boolean,
      //       default: false,
      //     },
      //     policeClearance: {
      //       type: Boolean,
      //       default: false,
      //     },
      //     TOR: {
      //       type: Boolean,
      //       default: false,
      //     },
      //     idPhoto: {
      //       type: Boolean,
      //       default: false,
      //     },
      //   },
      //   ids: {
      //     TIN: {
      //       type: Boolean,
      //       default: false,
      //     },
      //     SSS: {
      //       type: Boolean,
      //       default: false,
      //     },
      //     idPhoto: {
      //       type: Boolean,
      //       default: false,
      //     },
      //     philHealth: {
      //       type: Boolean,
      //       default: false,
      //     },
      //     pagIBIGFundNumber: {
      //       type: Boolean,
      //       default: false,
      //     },
      //   }
      // }
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
      screening: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ScreeningForm",
        }
      ],
      interview: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "InterviewForm",
        }
      ],
      jobOffer:
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "jobOfferForm",
      },
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
