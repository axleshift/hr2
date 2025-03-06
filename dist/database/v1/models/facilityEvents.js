"use strict";
/**
 * @file facilityDates.ts
 * @description Facility Dates model schema
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const facilityEventsSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    date: {
        type: Date,
        required: true,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    capacity: {
        type: Number,
        required: true,
    },
    participants: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        ref: "applicants",
    },
    timeslot: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "time",
    }
}, {
    timestamps: true,
    updateAt: true,
});
exports.default = mongoose_1.default.model("facilityEvents", facilityEventsSchema);
