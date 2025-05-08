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

// Represents a pending device fingerprint (user-agent + IP hash or string)
export type PendingDevice = string | null;

// Extend the express-session SessionData interface
declare module "express-session" {
  interface SessionData {
    user?: SessionUser;
    pendingDevice?: PendingDevice;
  }
}
