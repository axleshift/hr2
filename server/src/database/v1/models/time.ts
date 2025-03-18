import mongoose from "mongoose";

const timeSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    facility: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "facilities",
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "facilityEvents",
      required: false
    },
    start: {
      type: String,
      required: true,
    },
    end: {
      type: String,
      required: true,
    },
    participants: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "applicants",
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

export default mongoose.model("Time", timeSchema);