import { Request, Response } from "express";
import logger from "./logger";

export const errorHandler = (err: Error, req: Request, res: Response) => {
    logger.error(err);
    return res.status(500).json({
        statusCode: res.statusCode || 500,
        success: false,
        message: err.message,
        stack: err.stack,
    });
};
