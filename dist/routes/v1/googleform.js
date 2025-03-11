"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const googleFormController_1 = require("../../database/v1/controllers/googleFormController");
// no need to verify session for google form
router.post("/submit", googleFormController_1.formSubmit);
exports.default = {
    metadata: {
        path: "/googleform",
        description: "Google Form",
    },
    router,
};
