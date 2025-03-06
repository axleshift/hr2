"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const jobpostingRequestSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    quantity: {
        type: Number,
        default: 1,
        required: true,
    },
    location: {
        type: String,
        default: "Remote",
        required: true,
    },
    jobType: {
        type: [String],
        enum: ["full time", "part time", "contract", "internship", "temporary", "other"],
        default: ["full time"],
        required: true,
    },
    salaryRange: {
        type: String,
        default: "Not Specified",
        required: true,
    },
    contact: {
        type: String,
        default: "Not Specified",
    },
    email: {
        type: String,
        default: "Not Specified",
    },
    phone: {
        type: String,
        default: "Not Specified",
    },
    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending",
    },
}, {
    timestamps: true,
    updateAt: true,
});
exports.default = mongoose_1.default.model("JobpostingRequest", jobpostingRequestSchema);
