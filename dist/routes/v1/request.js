"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const verifyApiKey_1 = __importDefault(require("../../middlewares/verifyApiKey"));
const requestController_1 = require("../..//database/v1/controllers/requestController");
router.post("/jobposting", verifyApiKey_1.default, requestController_1.createJobpostingRequest);
router.get("/jobposting/search", verifyApiKey_1.default, requestController_1.searchJobpostingRequests);
router.get("/jobposting/:id", verifyApiKey_1.default, requestController_1.getJobpostingRequestById);
router.put("/jobposting/:id", verifyApiKey_1.default, requestController_1.updateJobpostingRequest);
exports.default = {
    metadata: {
        path: "/request",
        description: "This route is used to create, search, get and update jobposting requests",
    },
    router,
};
