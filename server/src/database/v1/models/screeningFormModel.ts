/**
 * @file screeningForm.ts
 * @description Screening Form model schema with AI analysis field
 */

import mongoose, { Schema, Document } from "mongoose";

export type ScreeningStatus = "pending" | "reviewed" | "rejected" | "shortlisted";
export type RecommendationStatus = "yes" | "no" | "needs further review" | "redirection"

const STATUS_ENUM = ["pending", "reviewed", "rejected", "shortlisted"]
const RECO_ENUM = ["yes", "no", "needs further review", "redirection"]

export interface IScreeningForm extends Document {
  applicant: mongoose.Types.ObjectId;
  reviewer: mongoose.Types.ObjectId;
  status: ScreeningStatus;
  recommendation: RecommendationStatus;
  job: mongoose.Types.ObjectId;
  aiAnalysis: {
    summary: string;
    scoreBreakdown: {
      experience: number;
      education: number;
      skills: number;
      motivation: number;
    };
    comments: string;
  };
}

const screeningFormSchema = new Schema<IScreeningForm>(
  {
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Applicant",
      required: true,
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: STATUS_ENUM,
      default: "pending",
    },
    recommendation: {
      type: String,
      enum: RECO_ENUM,
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
    },
    aiAnalysis: {
      summary: { type: String },
      scoreBreakdown: {
        experience: { type: Number, default: 1 },
        education: { type: Number, default: 1 },
        skills: { type: Number, default: 1 },
        motivation: { type: Number, default: 1 },
      },
      comments: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IScreeningForm>("ScreeningForm", screeningFormSchema);