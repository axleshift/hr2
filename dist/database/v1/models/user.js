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
// const developerSchema = new mongoose.Schema(
//   {
//     apKey: {
//       type: String,
//       required: true,
//     },
//     permissions: {
//       type: [String],
//       required: true,
//     },
//     expiresAt: {
//       type: Date,
//       required: true,
//     },
//   },
//   {
//     timestamps: true,
//     updateAt: true,
//   }
// );
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
        required: true,
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
        default: "user",
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
            type: Date
        }
    },
    rememberToken: {
        type: String,
        required: false,
    },
}, {
    timestamps: true,
    updateAt: true,
});
exports.default = mongoose_1.default.model("User", userSchema);
