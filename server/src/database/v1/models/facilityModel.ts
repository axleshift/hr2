/**
 * @file facilities.ts
 * @description Facilities model schema
 */

import mongoose, { Schema, Document, Types } from 'mongoose';

// Interface representing a Facility document

interface IRequirement {
  title: string;
  description?: string;
}

interface IFacilityBase {
  name: string;
  type: string;
  description?: string;
  requirements?: IRequirement[];
  location: string;
  timeslots: Types.ObjectId[];
}

export interface IFacility extends IFacilityBase, Document {
  _id: Types.ObjectId;
}

const requirementSchema = new Schema<IRequirement>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
  },
  // { _id: false } // This avoids adding _id to each requirement document. Re-enable if want. kek.
);

// Facility schema definition
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
    requirements: [requirementSchema],
    location: {
      type: String,
      required: true,
      trim: true,
    },
    timeslots: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Timeslot',
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IFacility>('Facility', facilitySchema);
