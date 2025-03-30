/**
 * @file jobModel.ts
 * @description Job model schema
 */

import mongoose, { Schema, Document } from "mongoose";

export type JobStatus = "open" | "closed";

export const CATEGORY_TYPES = ["internship", "full-time", "part-time", "contract", "temporary", "freelance"] as const;
export type JobCategory = (typeof CATEGORY_TYPES)[number];

export interface IJob extends Document {
  title: string;
  responsibilities: string;
  requirements: string;
  qualifications: string;
  benefits: string;
  category: JobCategory;
  capacity: number;
  jobpost: mongoose.Types.ObjectId;
}

const jobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: true,
    },
    responsibilities: {
      type: String,
      required: true,
    },
    requirements: {
      type: String,
      required: true,
    },
    qualifications: {
      type: String,
      required: true,
    },
    benefits: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: CATEGORY_TYPES,
      required: true,
    },
    capacity: {
      type: Number,
      default: 1,
    },
    jobpost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobPosting'
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IJob>("Job", jobSchema);
