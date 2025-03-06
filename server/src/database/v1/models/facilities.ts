/**
 * @file facilities.ts
 * @description Facilities model schema
 */

import mongoose from "mongoose";
const facilitiesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    location: {
      type: String,
      required: true,
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
);

export default mongoose.model("facilities", facilitiesSchema);