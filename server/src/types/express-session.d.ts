import "express-session";

interface SessionUser {
    username: string;
    role: string;
    email: string;
    status: string;
}

declare module "express-session" {
    interface SessionData {
        user: SessionUser;
    }
}
