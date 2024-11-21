import bcrypt from "bcryptjs";
import { Request, Response, NextFunction } from "express";

const generateCsrfToken = async (req: Request, res: Response, next: NextFunction) => {
    // Ensure that the session exists
    if (!req.session) {
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Session not initialized properly.",
        });
    }

    // If csrfToken is not already set, generate and store it
    if (!req.session.csrfToken) {
        try {
            const salt = await bcrypt.genSalt(10);
            const csrfToken = await bcrypt.hash(req.sessionID, salt); // Generate CSRF token from sessionID
            req.session.csrfToken = csrfToken; // Save CSRF token in session
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                success: false,
                message: "Error generating CSRF token.",
            });
        }
    }

    next(); // Proceed to the next middleware
};

export default generateCsrfToken;
