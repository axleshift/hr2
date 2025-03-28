"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const apiKeySchema = new mongoose_1.default.Schema({
    key: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: false,
    },
    permissions: {
        type: Array,
        required: true,
    },
    expiresAt: {
        type: Date,
        // this is the default expiration date with 1 year
        default: new Date().setFullYear(new Date().getFullYear() + 1),
        required: true,
    },
}, {
    timestamps: true,
    updateAt: true,
});
exports.default = mongoose_1.default.model("Apikey", apiKeySchema);
