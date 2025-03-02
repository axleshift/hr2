import mongoose from "mongoose";

const timeSchema = new mongoose.Schema(
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
      required: true,
    },
    participants: {
      type: Array,
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

export default mongoose.model("Time", timeSchema);