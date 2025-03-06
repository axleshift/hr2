"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const timeSchema = new mongoose_1.default.Schema({
    date: {
        type: Date,
        required: true,
    },
    facility: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "facilities",
        required: true,
    },
    event: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "facilityEvents",
        required: false
    },
    start: {
        type: String,
        required: true,
    },
    end: {
        type: String,
        required: true,
    },
    isAvaliable: {
        type: Boolean,
        default: true,
    },
    participants: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        ref: "applicants",
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
    updateAt: true,
});
exports.default = mongoose_1.default.model("Time", timeSchema);
