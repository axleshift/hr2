/**
 * @file /routes/v1/account.ts
 * @description This file contains the code for the account route
 */

import { Router } from "express";
const router = Router();

import dotenv from "dotenv";
dotenv.config();

import { getAllAccounts, getAccountById, updateAccount } from "../../database/v1/controllers/accountController";
import verifySession from "../../middlewares/verifySession";

router.get(
  "/all",
  verifySession({
    permissions: ["user", "admin"],
  },
  true,
),
  getAllAccounts
);
router.get(
  "/:id",
  verifySession({
    permissions: ["user", "admin"],
  },
  true,
),
  getAccountById
);
router.put(
  "/:id",
  verifySession({
    permissions: ["user", "admin"],
  },
  true,
),
  updateAccount
);
export default {
  metadata: {
    path: "/account",
    description: "This route is used to add, update, delete, get all, get by id, search and download account data",
  },
  router,
};
