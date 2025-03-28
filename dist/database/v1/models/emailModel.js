"use strict";
/**
 * @file email.ts
 * @description Email Document model schema
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const emailSchema = new mongoose_1.default.Schema({
    category: {
        type: String,
        enum: ["Inbox", "Sent", "Draft", "Template"],
        default: "Draft",
        required: true,
    },
    authorId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    recipients: [
        {
            recipientId: {
                type: mongoose_1.default.Schema.Types.ObjectId,
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
        type: mongoose_1.default.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
    updateAt: true,
});
exports.default = mongoose_1.default.model("Email", emailSchema);
