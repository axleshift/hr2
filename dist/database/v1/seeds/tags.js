"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tag_1 = __importDefault(require("../models/tag"));
const logger_1 = __importDefault(require("../../../middlewares/logger"));
const tags = [
    {
        name: "Screening",
        category: "Applicant",
        description: "Set applicant as status of screening",
        color: "#000000",
        isProtected: true,
        isSystem: true,
    },
    {
        name: "Interview",
        category: "Applicant",
        description: "Set applicant as status of interview",
        color: "#000000",
        isProtected: true,
        isSystem: true,
    },
    {
        name: "Training",
        category: "Applicant",
        description: "Set applicant as status of training",
        color: "#000000",
        isProtected: true,
        isSystem: true,
    },
    {
        name: "Shortlisted",
        category: "Applicant",
        description: "Set applicant as status of shortlisted",
        color: "#000000",
        isProtected: true,
        isSystem: true,
    },
    {
        name: "Rejected",
        category: "Applicant",
        description: "Set applicant as status of rejected",
        color: "#000000",
        isProtected: true,
        isSystem: true,
    }
];
const seedTag = async () => {
    try {
        await tag_1.default.deleteMany();
        await tag_1.default.insertMany(tags);
        return true;
    }
    catch (error) {
        logger_1.default.error(error);
        return false;
    }
};
exports.default = {
    metadata: {
        name: "tags",
        description: "This seed is used to add default tags",
    },
    run: seedTag,
};
