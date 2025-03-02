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
    participants: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "applicants",
    },
    timeslots: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "time",
    }
  },
  {
    timestamps: true,
    updateAt: true,
  }
)

export default mongoose.model("facilityEvents", facilityEventsSchema);