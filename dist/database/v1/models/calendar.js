"use strict";
/**
 * @file calendar.ts
 * @description Calendar model schema
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const calendarSchema = new mongoose_1.default.Schema({
    date: {
        type: Date,
        required: true,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    timeslots: {
        type: Array,
        // 10 am to 11 am, 11 am to 12 pm, 12 pm to 1 pm, 1 pm to 2 pm, 2 pm to 3 pm, 3 pm to 4 pm
        required: true,
    }
}, {
    timestamps: true,
    updateAt: true,
});
exports.default = mongoose_1.default.model("calendar", calendarSchema);
