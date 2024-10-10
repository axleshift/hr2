import mongoose from "mongoose";

const timeslotSchema = new mongoose.Schema(
    {
        date: {
            type: Date,
            required: true,
        },
        start: {
            type: String,
            required: true,
        },
        end: {
            type: String,
            required: true,
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        updateAt: true,
    }
);

export default mongoose.model("InterviewTimeslots", timeslotSchema);
