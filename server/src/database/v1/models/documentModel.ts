/**
 * @file document.ts
 * @description Document model schema
 */

import mongoose, { Schema, Document } from "mongoose";

export type DocumentCategory = "screening" | "interview" | "training" | "shortlisted" | "other";

export interface IDocument extends Document {
  category: DocumentCategory;
  author_Id: mongoose.Types.ObjectId;
  authorName: string;
  applicant_Id: mongoose.Types.ObjectId;
  applicantName: string;
  title: string;
  content?: string;
  tags?: string[];
}

const documentSchema = new Schema<IDocument>(
  {
    category: {
      type: String,
      enum: ["screening", "interview", "training", "shortlisted", "other"],
      required: true,
    },
    author_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    applicant_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Applicant",
      required: true,
    },
    applicantName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    tags: [{
      type: String,
    }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IDocument>("Document", documentSchema);
