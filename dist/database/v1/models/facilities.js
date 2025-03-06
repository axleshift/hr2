"use strict";
/**
 * @file facilities.ts
 * @description Facilities model schema
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const facilitiesSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    location: {
        type: String,
        required: true,
    },
    timeslots: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        ref: "time",
    }
}, {
    timestamps: true,
    updateAt: true,
});
exports.default = mongoose_1.default.model("facilities", facilitiesSchema);
