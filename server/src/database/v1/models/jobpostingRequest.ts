import mongoose from "mongoose";
const jobpostingRequestSchema = new mongoose.Schema(
    {
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
    },
    {
        timestamps: true,
        updateAt: true,
    }
);

export default mongoose.model("JobpostingRequest", jobpostingRequestSchema);
