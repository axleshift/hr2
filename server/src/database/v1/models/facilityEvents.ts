/**
 * @file facilityDates.ts
 * @description Facility Dates model schema
 */

import mongoose from "mongoose";

const facilityEventsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    description: {
      type: String,
    },
    date: {
      type: Date,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    participants: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "applicants",
    },
    timeslot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "time",
    }
  },
  {
    timestamps: true,
    updateAt: true,
  }
)

export default mongoose.model("facilityEvents", facilityEventsSchema);