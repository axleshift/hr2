import mongoose from "mongoose";

const timeslotSchema = new mongoose.Schema(
  {
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
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Applicants",
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
