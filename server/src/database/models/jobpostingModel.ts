import mongoose from "mongoose";

const jobpostingSchema = new mongoose.Schema(
    {
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
            required: true,
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
            required: true,
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
            required: true,
        },
    },
    {
        timestamps: true,
        updateAt: true,
    }
);

export default mongoose.model("JobPosting", jobpostingSchema);
