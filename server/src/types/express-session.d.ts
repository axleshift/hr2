import "express-session";

export interface SessionUser {
    _id: string;
    firstname: string;
    lastname: string;
    username: string;
    role: string;
    email: string;
    status: string;
    emailVerifiedAt?: Date | null;
}

// Extend the express-session SessionData interface
declare module "express-session" {
    interface SessionData {
        user?: SessionUser;
    }
}
