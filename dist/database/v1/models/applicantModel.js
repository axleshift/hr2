"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const certificationSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    authority: {
        type: String,
        required: true,
    },
    year: {
        type: String,
        required: true,
    },
});
// const workExperienceSchema = new mongoose.Schema({
//     company: {
//         type: String,
//         required: true,
//     },
//     position: {
//         type: String,
//         required: true,
//     },
//     startDate: {
//         type: Date,
//         required: true,
//     },
//     endDate: {
//         type: Date,
//         required: true,
//     },
//     description: {
//         type: String,
//         required: true,
//     },
// });
// const skillSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//     },
//     level: {
//         type: String,
//         required: true,
//     },
// });
// const educationSchema = new mongoose.Schema({
//     degree: {
//         type: String,
//         required: true,
//     },
//     institution: {
//         type: String,
//         required: true,
//     },
//     year: {
//         type: String,
//         required: true,
//     },
// });
// const remarksSchema = new mongoose.Schema({
//     interviewer: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Users",
//         required: true,
//     },
//     remarks: {
//         type: String,
//         required: true,
//     },
//     date: {
//         type: Date,
//         default: Date.now,
//     },
// });
const interviewSchema = new mongoose_1.default.Schema({
    interviewer: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    scheduleRef_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "InterviewSchedules",
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
    },
    remarks: {
        type: String,
    },
});
const applicantSchema = new mongoose_1.default.Schema({
    firstname: {
        type: String,
        required: true,
    },
    middlename: {
        type: String,
        required: false,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    portfolioURL: {
        type: String,
    },
    professionalSummary: {
        type: String,
        required: true,
    },
    skills: {
        type: String,
        required: true,
    },
    workExperience: {
        type: String,
        required: true,
    },
    education: {
        type: String,
        required: true,
    },
    certifications: {
        type: [certificationSchema],
        required: true,
    },
    tags: {
        type: [String],
        required: true,
    },
    remarks: {
        type: String,
    },
    resumeFileLoc: {
        type: String,
        required: true,
    },
    interviews: {
        type: [interviewSchema],
        default: [],
    },
    expiresAt: {
        type: Date,
        required: true,
        default: new Date().setDate(new Date().getDate() + 30), // 30 days from now
    },
}, {
    timestamps: true,
    updateAt: true,
});
exports.default = mongoose_1.default.model("Applicant", applicantSchema);
