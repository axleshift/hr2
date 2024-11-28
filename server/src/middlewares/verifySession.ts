import { Request, Response, NextFunction } from "express";

const verifySession = (requiredRoles: string[] = []) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.session.user) {
            return res.status(401).json({
                statusCode: 401,
                success: false,
                message: "Unauthorized",
            });
        }

        // If requiredRoles is specified, check if the user's role matches
        const userRole = req.session.user.role;
        const csrfToken = req.session.csrfToken;

        if (requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
            return res.status(403).json({
                statusCode: 403,
                success: false,
                message: "Forbidden: You do not have the required permissions",
            });
        }

        // const clientToken = req.headers["x-csrf-token"] as string || csrfToken as string;
        // if (!clientToken) {
        //     return res.status(403).json({
        //         statusCode: 403,
        //         success: false,
        //         message: "Forbidden: CSRF token missing",
        //     });
        // }
    
        // if (clientToken !== csrfToken) {
        //     return res.status(403).json({
        //         statusCode: 403,
        //         success: false,
        //         message: "Forbidden: Invalid CSRF token",
        //     });
        // }

        // console.info("Session CSRF TOKEN  -> csrfToken", csrfToken);

        // User is authenticated and authorized
        next();
    };
};

export default verifySession;
