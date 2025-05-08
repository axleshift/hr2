"use strict";
/**
 * @file applicant.ts
 * @description Applicant model schema
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const APPLICANT_STATUS = ['Rejected', 'Hired', 'Active'];
const mongoose_1 = __importDefault(require("mongoose"));
const applicantSchema = new mongoose_1.default.Schema({
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
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Event",
        }],
    emails: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Email"
        }],
    documentations: {
        screening: [
            {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "ScreeningForm",
            }
        ],
        interview: [
            {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "InterviewForm",
            }
        ],
        jobOffer: {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "jobOfferForm",
        },
        others: [
            {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "Document",
            }
        ]
    },
    expiresAt: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model("Applicant", applicantSchema);
