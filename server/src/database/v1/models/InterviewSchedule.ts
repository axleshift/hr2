import mongoose from "mongoose";

const interviewSchedSchema = new mongoose.Schema(
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
                type: mongoose.Schema.Types.ObjectId,
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
    },
    {
        timestamps: true,
        updateAt: true,
    }
);

export default mongoose.model("InterviewSchedules", interviewSchedSchema);
