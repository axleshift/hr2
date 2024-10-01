import { Request, Response, NextFunction } from "express";

declare module "express-session" {
  interface Session {
    jwt?: string;
  }
}

const verifySession = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.jwt) {
    // User is authenticated, proceed to the next middleware/route handler
    return next();
  } else {
    // User is not authenticated, send an unauthorized response

    res.status(401).json({ message: "Unauthorized" });
  }
};

export default verifySession;
