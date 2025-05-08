"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const verificationSchema = new mongoose_1.default.Schema({
    code: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
});
const OtpSchema = new mongoose_1.default.Schema({
    code: {
        type: String,
    },
    expiresAt: {
        type: Date
    }
});
const userSchema = new mongoose_1.default.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: false, // Password is optional for Google users
    },
    emailVerifiedAt: {
        type: Date,
        required: false,
    },
    verification: {
        type: verificationSchema,
        required: false,
    },
    role: {
        type: String,
        default: "User",
    },
    status: {
        type: String,
        default: "inactive",
    },
    suspension: {
        status: {
            type: Boolean,
            default: false,
        },
        reason: {
            type: String,
        },
        expiresAt: {
            type: Date,
        },
    },
    rememberToken: {
        type: String,
        required: false,
    },
    otp: {
        type: OtpSchema
    },
    knownDevices: [{
            type: String,
        }],
    // Google-related fields
    googleId: {
        type: String,
        required: false, // Not required unless the user logged in with Google
    },
    displayName: {
        type: String,
        required: false, // Not required unless the user logged in with Google
    },
    googleEmail: {
        type: String,
        required: false, // Not required unless the user logged in with Google
    },
    googleAvatar: {
        type: String,
        required: false, // Optional avatar URL for Google users
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("User", userSchema);
