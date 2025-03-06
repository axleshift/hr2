/**
 * @file calendar.ts
 * @description Calendar model schema
 */

import mongoose from "mongoose";

const calendarSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    timeslots: {
      type: Array,
      // 10 am to 11 am, 11 am to 12 pm, 12 pm to 1 pm, 1 pm to 2 pm, 2 pm to 3 pm, 3 pm to 4 pm
      required: true,
    }
  },
  {
    timestamps: true,
    updateAt: true,
  }
);

export default mongoose.model("calendar", calendarSchema);