import { Request as req, Response as res, NextFunction } from "express";

// sendError helper function
const sendError = (res: res, statusCode: number, message: string) => {
  console.error(`Error ${statusCode}: ${message}`);
  return res.status(statusCode).json({
    statusCode,
    success: false,
    message,
  });
};

interface Metadata {
  permissions: string[];
}

const verifySession = (metadata: Metadata, allowGuest = false) => {
  return (req: req, res: res, next: NextFunction) => {
    const user = req.session.user; // Use Passport's way of accessing the authenticated user
    console.info("User: ", user)


    if (!user) {
      if (allowGuest) return next();
      return sendError(res, 401, "Unauthorized: No user logged in");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userRole = (user as any).role;
    if (!userRole || typeof userRole !== "string") {
      return sendError(res, 401, "Unauthorized: Invalid user role");
    }

    const permissions = metadata.permissions;
    if (permissions.length > 0 && !permissions.includes(userRole)) {
      return sendError(res, 403, "Forbidden: Insufficient permissions");
    }

    next();
  };
};

export default verifySession;
