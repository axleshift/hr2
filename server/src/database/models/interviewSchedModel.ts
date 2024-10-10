import mongoose from "mongoose";

const interviewSchedModel = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
            default: "Interview Schedule" + Date.now(),
        },
        timeslotRef_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "InterviewTimeslots",
            required: false,
        },
        date: {
            type: Date,
            required: true,
        },
        location: {
            type: String,
            required: false,
        },
        additionalInfo: {
            type: String,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isExpired: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        updateAt: true,
    }
);

export default mongoose.model("InterviewSchedules", interviewSchedModel);
