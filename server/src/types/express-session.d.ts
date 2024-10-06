import "express-session";

export interface SessionUser {
    username: string;
    role: string;
    email: string;
    status: string;
    token: string;
}

declare module "express-session" {
    interface SessionData {
        user: SessionUser;
    }
}
