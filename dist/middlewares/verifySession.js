"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const verifySession = (requiredRoles = []) => {
    return (req, res, next) => {
        if (!req.session.user) {
            return res.status(401).json({
                statusCode: 401,
                success: false,
                message: "Unauthorized",
            });
        }
        // If requiredRoles is specified, check if the user's role matches
        const userRole = req.session.user.role;
        if (requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
            return res.status(403).json({
                statusCode: 403,
                success: false,
                message: "Forbidden: You do not have the required permissions",
            });
        }
        // User is authenticated and authorized
        next();
    };
};
exports.default = verifySession;
