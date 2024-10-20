"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const interviewSchedSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        default: "Interview Schedule" + Date.now(),
    },
    timeslotRef_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "InterviewTimeslots",
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    location: {
        type: String,
        default: null,
    },
    capacity: {
        type: Number,
        default: 1,
    },
    participants: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "users",
        },
    ],
    additionalInfo: {
        type: String,
        default: null,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isExpired: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    updateAt: true,
});
exports.default = mongoose_1.default.model("InterviewSchedules", interviewSchedSchema);
