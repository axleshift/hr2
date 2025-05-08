"use strict";
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
const OFFER_STATUSES = ['Pending', 'Accepted', 'Declined'];
const JOB_TYPES = ['Contractual', 'Regular', 'Temporary', 'Freelance']; // New Enum for job types
const jobOfferFormSchema = new mongoose_1.Schema({
    applicant: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Applicant',
        required: true,
    },
    position: {
        type: mongoose_1.Schema.Types.Mixed,
        validate: {
            validator(value) {
                return mongoose_1.default.Types.ObjectId.isValid(value) || typeof value === 'string';
            },
            message: 'Position must be a valid ObjectId or a string.',
        },
    },
    salary: {
        type: Number,
        required: true,
    },
    salaryType: {
        type: String,
        enum: ['Hourly', 'Annual'],
        default: 'Annual',
    },
    startDate: {
        type: Date,
        required: true,
    },
    benefits: {
        type: String,
    },
    contractDuration: {
        type: String,
        default: null,
    },
    location: {
        type: String,
        required: true,
    },
    workHours: {
        type: String,
    },
    jobType: {
        type: String,
        enum: JOB_TYPES,
        required: true, // This field is now required
    },
    status: {
        type: String,
        enum: OFFER_STATUSES,
        default: 'Pending',
    },
    issuedBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    issuedDate: {
        type: Date,
        default: () => new Date(),
    },
    responseDate: {
        type: Date,
    },
    approvedBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
    },
    approvedDate: {
        type: Date,
    },
    emailsent: {
        type: Boolean,
        default: false,
    },
    emailSentDate: {
        type: Date,
    },
    expires: {
        type: Date,
    },
    notes: {
        type: String,
        default: '',
    },
    probationPeriod: {
        type: String,
        default: null,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model('JobOfferForm', jobOfferFormSchema);
