import mongoose from "mongoose";
const interviewSchema = new mongoose.Schema(
    {
        ref_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        applicant_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Applicant",
        },
        interview_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "InterviewSchedule",
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

export default mongoose.model("Interview", interviewSchema);
