import mongoose from "mongoose";
import { config } from "../config";
import logger from "../middlewares/logger";

const dbConnection = async () => {
    try {
        const uri = config.mongoDB.uri as string;
        await mongoose.connect(uri);
        return true;
    } catch (error) {
        logger.error(error);
        return false;
    }
};

// loop till db is connected
export const connectDB = async () => {
    let connected = false;
    logger.info("🙏 Attempting to connect to MongoDB");
    while (!connected) {
        connected = await dbConnection();
    }
    if (connected) {
        logger.info("🌿 Connected to MongoDB");
    } else {
        logger.error("🚫 WARNING! Could not connect to MongoDB");
    }
};
