"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const interviewSchema = new mongoose_1.default.Schema({
    ref_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
    },
    applicant_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Applicant",
    },
    interview_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "InterviewSchedule",
    },
    additional_info: {
        type: String,
        required: false,
    },
}, {
    timestamps: true,
    updateAt: true,
});
exports.default = mongoose_1.default.model("Interview", interviewSchema);
