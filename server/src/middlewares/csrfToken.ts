/**
 * @file /middlewares/csrfToken.ts
 * @description Middleware to generate CSRF token
 * @description This middleware generates a CSRF token from the sessionID and stores it in the session
 */
import bcrypt from "bcryptjs";
import { Request, Response, NextFunction } from "express";
import { config } from "../config";

const generateCsrfToken = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session) {
    return res.status(500).json({ success: false, message: "Session not initialized properly." });
  }

  if (!req.session.csrfToken) {
    try {
      const salt = await bcrypt.genSalt(10);
      const csrfToken = await bcrypt.hash(req.sessionID, salt);
      req.session.csrfToken = csrfToken;
    } catch (error) {
      return res.status(500).json({ success: false, message: error });
    }
  }

  // 🔹 Set CSRF token as an HTTP-only cookie
  res.cookie("csrfToken", req.session.csrfToken, {
    httpOnly: config.env === "production",
    secure: config.env === "production",
    sameSite: "strict",
  });

  next();
};

export default generateCsrfToken;
