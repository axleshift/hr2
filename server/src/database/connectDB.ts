import mongoose from "mongoose";
import { config } from "../config";
import logger from "../middlewares/logger";

const dbConnection = async () => {
    try {
        await mongoose.connect(config.mongoDB.uri);
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
    }
};
