/**
 * @file hasher.ts
 * @description Hashes a string using bcrypt
 */

import logger from "../middlewares/logger";
import bcrypt from "bcryptjs";

const hasher = async (string: string, salt: string) => {
    try {
        const hashedString = bcrypt.hash(string, salt);
        return hashedString;
    } catch (error) {
        logger.error("Error hashing string:", error);
        throw new Error("Error hashing string");
    }
};

export { hasher };
