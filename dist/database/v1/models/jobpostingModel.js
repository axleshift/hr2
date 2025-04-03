"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const jobpostingSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    // company: {
    //   type: String,
    //   required: true,
    // },
    salary_min: {
        type: Number,
        required: true,
    },
    salary_max: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    requirements: {
        type: String,
        required: true,
    },
    responsibilities: {
        type: String,
        required: true,
    },
    benefits: {
        type: String,
        required: true,
    },
    status: {
        type: String,
    },
    schedule_start: {
        type: Date,
        required: true,
    },
    schedule_end: {
        type: Date,
        required: true,
    },
    isExpired: {
        type: Boolean,
        required: false,
    },
}, {
    timestamps: true,
    updateAt: true,
});
exports.default = mongoose_1.default.model("JobPosting", jobpostingSchema);
