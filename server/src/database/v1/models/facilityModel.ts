/**
 * @file facilities.ts
 * @description Facilities model schema
 */

import mongoose, { Schema, Document, Types } from 'mongoose';

// Interface representing a Facility document
interface IFacility extends Document {
  name: string;
  type: string;
  description?: string;
  location: string;
  timeslots: Types.ObjectId[];
}

// Schema definition for the Facility model
const facilitySchema = new Schema<IFacility>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    timeslots: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Time',
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IFacility>('Facility', facilitySchema);