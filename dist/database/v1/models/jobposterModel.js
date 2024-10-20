"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const jobposterSchema = new mongoose_1.default.Schema({
    ref_id: {
        type: String,
        required: true,
    },
    platform: {
        type: String,
        required: true,
    },
    post_id: {
        type: String,
        // required: true,
    },
    content: {
        type: String,
        required: true,
        unique: true,
    },
    isPosted: {
        type: Boolean,
        required: true,
    },
    isApproved: {
        type: Boolean,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    postAt: {
        type: Date,
        required: false,
    },
    expiresAt: {
        type: Date,
        required: false,
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        required: true,
    },
}, {
    timestamps: true,
    updateAt: true,
});
exports.default = mongoose_1.default.model("Jobposter", jobposterSchema);
