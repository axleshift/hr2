"use strict";
/**
 * @file screeningForm.ts
 * @description Screening Form model schema with AI analysis field
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const STATUS_ENUM = ["pending", "reviewed", "rejected", "shortlisted"];
const RECO_ENUM = ["yes", "no", "needs further review", "redirection"];
const screeningFormSchema = new mongoose_1.Schema({
    applicant: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Applicant",
        required: true,
    },
    reviewer: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
        type: mongoose_1.default.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("ScreeningForm", screeningFormSchema);
