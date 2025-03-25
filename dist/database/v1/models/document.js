"use strict";
/**
 * @file document.ts
 * @description Document model schema
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const documentSchema = new mongoose_1.default.Schema({
    category: {
        type: String,
        enum: ["screening", "interview", "training", "shortlisted", "other"],
        required: true,
    },
    author_Id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    authorName: {
        type: String,
        required: true,
    },
    applicant_Id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Applicants",
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
            required: false,
        }],
}, {
    timestamps: true,
    updateAt: true,
});
exports.default = mongoose_1.default.model("document", documentSchema);
