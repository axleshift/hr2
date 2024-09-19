import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import logger from "./logger";

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    logger.error("Authorization header is missing");
    return res.status(403).json({ message: "Authorization header is missing" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    logger.error("Token is missing");
    return res.status(403).json({ message: "Token is missing" });
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      logger.error("Invalid or expired token:", err);
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    (req as any).user = decoded;
    next();
  });
};

export default verifyJWT;
