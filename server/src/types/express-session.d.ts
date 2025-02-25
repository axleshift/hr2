import "express-session";

export interface SessionUser {
    username: string;
    role: string;
    email: string;
    status: string;
    token: string;
    emailVerifiedAt: Date | null;
    // permissions: string[];
}

// Extend the express-session SessionData interface
declare module "express-session" {
    interface SessionData {
        user?: SessionUser; // Use `user?` to make it optional since it may not exist in some cases (e.g., if not logged in)
        csrfToken?: string; // Optional CSRF token in session
    }
}
