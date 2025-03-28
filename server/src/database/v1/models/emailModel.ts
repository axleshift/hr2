/**
 * @file email.ts
 * @description Email Document model schema
 */

import mongoose from "mongoose";
const emailSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["Inbox", "Sent", "Draft", "Template"],
      default: "Draft",
      required: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipients: [
      {
        recipientId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        recipientType: {
          type: String,
          enum: ["User", "Applicant"],
          required: true,
        },
      },
    ],
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
    },
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Email",
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    attachments: [
      {
        type: String, // Store file URLs or paths
      },
    ],
  },
  {
    timestamps: true,
    updateAt: true,
  }
);

export default mongoose.model("Email", emailSchema);
