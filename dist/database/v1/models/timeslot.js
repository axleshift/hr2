"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const timeslotSchema = new mongoose_1.default.Schema({
    date: {
        type: Date,
        required: true,
    },
    start: {
        type: Date,
        required: true,
    },
    end: {
        type: Date,
        required: true,
    },
    capacity: {
        type: Number,
        default: 1,
        required: true,
    },
    participants: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        ref: "Applicants",
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
    updateAt: true,
});
exports.default = mongoose_1.default.model("InterviewTimeslots", timeslotSchema);
