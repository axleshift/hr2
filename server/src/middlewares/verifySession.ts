import { Request, Response, NextFunction } from "express";

const verifySession = (req: Request, res: Response, next: NextFunction) => {
    if (req.session.user) {
        return next();
    } else {
        // User is not authenticated, send an unauthorized response

        res.status(401).json({ message: "Unauthorized" });
    }
};

export default verifySession;
