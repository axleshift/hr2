import ems from "express-mongo-sanitize";
import { Request, Response, NextFunction } from "express";

const sanitize = (req: Request, res: Response, next: NextFunction) => {
    ems.sanitize(req.body);
    ems.sanitize(req.params);
    ems.sanitize(req.query);
    next();
};

export default sanitize;
