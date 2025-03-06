"use strict";
/**
 * @file /routes/v1/account.ts
 * @description This file contains the code for the account route
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const accountController_1 = require("../../database/v1/controllers/accountController");
const verifySession_1 = __importDefault(require("../../middlewares/verifySession"));
router.get("/all", (0, verifySession_1.default)({
    permissions: ["admin", "superadmin"],
}), accountController_1.getAllAccounts);
router.get("/:id", (0, verifySession_1.default)({
    permissions: ["admin", "superadmin"],
}), accountController_1.getAccountById);
router.put("/:id", (0, verifySession_1.default)({
    permissions: ["admin", "superadmin"],
}), accountController_1.updateAccount);
exports.default = {
    metadata: {
        path: "/account",
        description: "This route is used to add, update, delete, get all, get by id, search and download account data",
    },
    router,
};
