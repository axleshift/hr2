import mongoose from "mongoose";

const jobposterSchema = new mongoose.Schema(
    {
        ref_id: {
            type: String,
            required: true,
        },
        platform: {
            type: String,
            required: true,
        },
        post_id: {
            type: String,
            // required: true,
        },
        content: {
            type: String,
            required: true,
            unique: true,
        },
        isPosted: {
            type: Boolean,
            required: true,
        },

        isApproved: {
            type: Boolean,
            required: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        postAt: {
            type: Date,
            required: false,
        },
        expiresAt: {
            type: Date,
            required: false,
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            required: true,
        },
    },
    {
        timestamps: true,
        updateAt: true,
    }
);

export default mongoose.model("Jobposter", jobposterSchema);
