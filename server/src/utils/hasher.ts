import logger from "../middleware/logger";
import bcrypt from "bcryptjs";

const hasher = async (password: string, salt: string) => {
  try {
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    logger.error("Error hashing password:", error);
    throw new Error("Error hashing password");
  }
};

export { hasher };
