"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const apikeyModel_1 = __importDefault(require("./apikeyModel"));
const userSettingsSchema = new mongoose_1.default.Schema({
    user_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
    },
    theme: {
        type: String,
        default: "light",
    },
    toast: {
        duration: {
            type: Number,
            default: 5000,
        },
    },
    email_notifications: {
        type: Boolean,
        default: true,
    },
    push_notifications: {
        type: Boolean,
        default: true,
    },
    developer: {
        status: {
            type: Boolean,
            default: false,
        },
        apiKeys: [apikeyModel_1.default],
    },
}, {
    timestamps: true,
    updateAt: true,
});
exports.default = mongoose_1.default.model("UserSetting", userSettingsSchema);
