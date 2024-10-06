import mongoose from "mongoose";
const interviewSchema = new mongoose.Schema(
    {
        applicant_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Applicant",
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        time: {
            type: String,
            required: true,
        },
        additional_info: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
        updateAt: true,
    }
);

export default mongoose.model("Test", interviewSchema);
