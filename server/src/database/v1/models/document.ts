/**
 * @file document.ts
 * @description Document model schema
 */

import mongoose from "mongoose";
const documentSchema = new mongoose.Schema(
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
    tags: {
      type: [String],
      required: false,
    },
  },
  {
    timestamps: true,
    updateAt: true,
  }
);

export default mongoose.model("document", documentSchema);
