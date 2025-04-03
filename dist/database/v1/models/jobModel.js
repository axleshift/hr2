"use strict";
/**
 * @file jobModel.ts
 * @description Job model schema
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
exports.CATEGORY_TYPES = void 0;
const mongoose_1 = __importStar(require("mongoose"));
exports.CATEGORY_TYPES = ["internship", "full-time", "part-time", "contract", "temporary", "freelance"];
const jobSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose_1.Schema.Types.Mixed,
        validate: {
            validator(value) {
                return mongoose_1.default.Types.ObjectId.isValid(value) || typeof value === 'string';
            },
            message: 'Author must be a valid ObjectId or a string.',
        },
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
        enum: exports.CATEGORY_TYPES,
        required: true,
    },
    capacity: {
        type: Number,
        default: 1,
    },
    jobpost: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'JobPosting'
    }
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("Job", jobSchema);
