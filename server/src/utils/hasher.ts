import logger from "../middlewares/logger";
import bcrypt from "bcryptjs";

const hasher = async (password: string, salt: string) => {
    try {
        const hashedPassword = bcrypt.hashSync(password, salt);
        return hashedPassword;
    } catch (error) {
        logger.error("Error hashing password:", error);
        throw new Error("Error hashing password");
    }
};

export { hasher };
